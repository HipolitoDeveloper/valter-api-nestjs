import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { UserControllerNamespace } from '../user/user.type';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SigninBody } from './auth.validator';
import CreateUserBody = UserControllerNamespace.CreateUserBody;

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    getProfile: jest.fn(),
    finishRegister: jest.fn(),
  };

  let signInDto: SigninBody;
  let createUserDto: CreateUserBody;
  let signInResponse;
  let signUpResponse;
  let userProfileMock;
  let requestMock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        ExceptionHandler,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    // userProfileMock = mocks.USER_MOCK.REPOSITORY.getProfile;
    requestMock = {
      currentUser: mocks.USER_MOCK.currentUser,
    };
    signInDto = {
      email: 'email@teste.com',
      password: 'password',
    };
    // createUserDto = mocks.USER_MOCK.SERVICE.createUserDto;
    signInResponse = {
      id: 1,
      email: 'email@teste.com',
      name: 'email',
      access_token: 'fake_token',
      refresh_token: 'fake_token',
      expires_in: 86400,
    };
    signUpResponse = {
      id: 1,
      name: 'email',
    };
  });

  describe('signIn', () => {
    it('should sign in a user and return the signed information', async () => {
      mockAuthService.signIn.mockResolvedValue(signInResponse);

      const result = await authController.signIn(signInDto);

      expect(result).toEqual(signInResponse);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });

    it('should handle sign in failure', async () => {
      const errorMessage = 'Invalid credentials';
      mockAuthService.signIn.mockRejectedValue(new Error(errorMessage));

      await expect(authController.signIn(signInDto)).rejects.toThrowError(
        errorMessage,
      );

      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });

  describe('signUp', () => {
    it('should register a user and return the user data', async () => {
      mockAuthService.signUp.mockResolvedValue(signUpResponse);

      const result = await authController.create(createUserDto);

      expect(result).toEqual(signUpResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'User registration failed';
      mockAuthService.signUp.mockRejectedValue(new Error(errorMessage));

      await expect(authController.create(createUserDto)).rejects.toThrowError(
        errorMessage,
      );

      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  it('should return the current user profile', async () => {
    mockAuthService.getProfile.mockResolvedValue(userProfileMock);

    const result = await authController.me(requestMock);
    expect(result).toEqual(userProfileMock);
    expect(mockAuthService.getProfile).toHaveBeenCalledWith(
      requestMock.currentUser.id,
    );
  });

  describe('finishRegister', () => {
    let finishRegisterMock;

    beforeEach(() => {
      finishRegisterMock = mocks.USER_MOCK.SERVICE.update;
    });

    it('should finishRegister and return the user data', async () => {
      mockAuthService.finishRegister.mockResolvedValue(finishRegisterMock);

      const result = await authController.finishRegister({
        email: 'email@email.com',
        password: 'password',
      });

      expect(result).toEqual(finishRegisterMock);
      expect(mockAuthService.finishRegister).toHaveBeenCalledWith(
        'email@email.com',
        'password',
      );
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'User registration failed';
      mockAuthService.finishRegister.mockRejectedValue(new Error(errorMessage));

      await expect(
        authController.finishRegister({
          email: 'email@email.com',
          password: 'password',
        }),
      ).rejects.toThrowError(errorMessage);

      expect(mockAuthService.finishRegister).toHaveBeenCalledWith(
        'email@email.com',
        'password',
      );
    });
  });
});
