import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { hash, isMatchHash } from '../../helper/hash.handler';
import { UserService } from '../user/user.service';
import { UserControllerNamespace } from '../user/user.type';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

jest.mock('../../helper/hash.handler', () => ({
  hash: jest.fn(),
  isMatchHash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let authRepository: AuthRepository;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockAuthRepository = {
    upsertSession: jest.fn(),
    findByUserId: jest.fn(),
  };

  let userMock;
  let findByEmailMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuthRepository, useValue: mockAuthRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    authRepository = module.get<AuthRepository>(AuthRepository);

    userMock = mocks.USER_MOCK.SERVICE.userMock;

    findByEmailMock = mocks.USER_MOCK.REPOSITORY.findByEmail;
  });

  describe('signIn', () => {
    it('should sign in a user and return tokens', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(findByEmailMock);
      (isMatchHash as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('fake_token');
      mockConfigService.get.mockReturnValue('jwt_secret');

      const result = await authService.signIn(userMock.email, 'password123');

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        userMock.email,
      );
      expect(isMatchHash).toHaveBeenCalledWith(
        'password123',
        findByEmailMock.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'fake_token',
        refreshToken: 'fake_token',
        expiresAt: {
          accessToken: expect.any(Number),
          refreshToken: expect.any(Number),
        },
        expiresIn: {
          accessToken: expect.any(Number),
          refreshToken: expect.any(Number),
        },
        firstName: findByEmailMock.firstName,
      });
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(findByEmailMock);
      (isMatchHash as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn(userMock.email, 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        userMock.email,
      );
      expect(isMatchHash).toHaveBeenCalledWith(
        'wrongpassword',
        findByEmailMock.password,
      );
    });

    it('should throw ErrorException if user is not found', async () => {
      mockUserService.findOneByEmail.mockRejectedValue(new Error());

      await expect(
        authService.signIn(userMock.email, 'password123'),
      ).rejects.toThrowError(new ErrorException(ERRORS.DATABASE_ERROR));

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        userMock.email,
      );
    });
  });

  describe('signUp', () => {
    let findOneByEmailMock;
    beforeEach(() => {
      findOneByEmailMock = mocks.USER_MOCK.REPOSITORY.findByEmail;
    });

    it('should sign up a user and return tokens', async () => {
      const hashedPassword = 'hashed_password';
      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserService.findOneByEmail.mockResolvedValue(null);

      mockUserService.create.mockResolvedValue(findByEmailMock);
      mockJwtService.signAsync.mockResolvedValue('fake_token');
      mockConfigService.get.mockReturnValue('jwt_secret');

      const result = await authService.signUp(userMock);

      expect(hash).toHaveBeenCalledWith(userMock.password);
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...userMock,
        password: hashedPassword,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result.accessToken).toEqual('fake_token');
      expect(result.refreshToken).toEqual('fake_token');
    });

    it('should throw ErrorException if user creation fails', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashed_password');
      mockUserService.create.mockRejectedValue(new Error());

      await expect(authService.signUp(userMock)).rejects.toThrowError(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );

      expect(mockUserService.create).toHaveBeenCalledWith({
        ...userMock,
        password: 'hashed_password',
      });
    });
  });

  describe('refreshTokens', () => {
    let findByUserIdMock;

    beforeEach(() => {
      findByUserIdMock = mocks.SESSION_MOCK.REPOSITORY.findByUserId;
    });

    it('should refresh tokens if the refresh token is valid', async () => {
      mockAuthRepository.findByUserId.mockResolvedValue(findByUserIdMock);
      (isMatchHash as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('new_fake_token');

      const result = await authService.refreshTokens(
        findByUserIdMock.userId,
        'refresh_token',
      );

      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(
        findByUserIdMock.userId,
      );
      expect(isMatchHash).toHaveBeenCalledWith(
        'refresh_token',
        'old_refresh_token',
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result.accessToken).toEqual('new_fake_token');
      expect(result.refreshToken).toEqual('new_fake_token');
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      mockAuthRepository.findByUserId.mockResolvedValue(findByUserIdMock);
      (isMatchHash as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.refreshTokens(findByUserIdMock.userId, 'invalid_token'),
      ).rejects.toThrow(new ErrorException(ERRORS.UNAUTHORIZED));

      expect(mockAuthRepository.findByUserId).toHaveBeenCalledWith(
        findByEmailMock.id,
      );
      expect(isMatchHash).toHaveBeenCalledWith(
        'invalid_token',
        'old_refresh_token',
      );
    });
  });

  describe('logout', () => {
    it('should clear the refresh token on logout', async () => {
      await authService.logout(findByEmailMock.id);

      expect(mockAuthRepository.upsertSession).toHaveBeenCalledWith(
        findByEmailMock.id,
        null,
      );
    });
  });
});
