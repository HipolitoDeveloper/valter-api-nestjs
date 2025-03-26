import { Test, TestingModule } from '@nestjs/testing';
import { hash } from '../../helper/hash.handler';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ERRORS } from '../../common/enum';
import mocks from '../../../test/mocks';

import { UserControllerNamespace, UserRepositoryNamespace } from './user.type';

jest.mock('../../helper/hash.handler', () => ({
  hash: jest.fn(),
  isMatchHash: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    let userMock: UserControllerNamespace.CreateUserBody;
    let userCreateMock: UserRepositoryNamespace.User;
    let currentUserMock;

    beforeEach(() => {
      userMock = mocks.USER_MOCK.SERVICE.userMock;
      userCreateMock = mocks.USER_MOCK.REPOSITORY.create;
      currentUserMock = mocks.USER_MOCK.currentUser;

      (hash as jest.Mock).mockResolvedValue(userMock.password);
    });

    it('should create a user successfully', async () => {
      jest.spyOn(userRepository, 'create').mockResolvedValue(userCreateMock);

      const result = await userService.create(userMock, currentUserMock);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: userMock.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: userMock.password,
        firstname: userMock.firstName,
        surname: userMock.surname,
        birthday: userMock.birthday,
        pantry: {
          connect: {
            id: '',
          },
        },
      } as typeof userMock);
      expect(result).toEqual({
        id: userCreateMock.id,
        firstName: userCreateMock.firstname,
        email: userCreateMock.email,
      });
    });

    it('should throw `CREATE_ENTITY_ERROR` if creation fails', async () => {
      jest.spyOn(userRepository, 'create').mockRejectedValue(new Error());

      await expect(
        userService.create(userMock, currentUserMock),
      ).rejects.toThrowError(new ErrorException(ERRORS.CREATE_ENTITY_ERROR));
    });
  });

  describe('update', () => {
    let userMock: UserControllerNamespace.UpdateUserBody;
    let userUpdateMock: UserRepositoryNamespace.User;

    beforeEach(() => {
      userMock = mocks.USER_MOCK.SERVICE.userMock;
      userUpdateMock = mocks.USER_MOCK.REPOSITORY.update;

      (hash as jest.Mock).mockResolvedValue(userMock.password);
    });

    it('should update a user successfully', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(userUpdateMock);

      const result = await userService.update(userMock);

      expect(userRepository.update).toHaveBeenCalledWith(
        {
          email: userMock.email,
          password: userMock.password,
          firstname: userMock.firstName,
          surname: userMock.surname,
          birthday: userMock.birthday,
        } as typeof userMock,
        userMock.id,
      );
      expect(result).toEqual({
        id: userUpdateMock.id,
        firstName: userUpdateMock.firstname,
        email: userUpdateMock.email,
      });
    });

    it('should throw `UPDATE_ENTITY_ERROR` if update fails', async () => {
      jest.spyOn(userRepository, 'update').mockRejectedValue(new Error());

      await expect(userService.update(userMock)).rejects.toThrowError(
        new ErrorException(ERRORS.UPDATE_ENTITY_ERROR),
      );
    });
  });

  describe('findOneById', () => {
    let userFindByIdMock: UserRepositoryNamespace.User;

    beforeAll(() => {
      userFindByIdMock = mocks.USER_MOCK.REPOSITORY.findById;
    });

    it('should return a user by ID', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(userFindByIdMock);

      const result = await userService.findOneById('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: userFindByIdMock.id,
        firstName: userFindByIdMock.firstname,
        surname: userFindByIdMock.surname,
        email: userFindByIdMock.email,
      });
    });

    it('should throw `DATABASE_ERROR` if repository fails', async () => {
      jest.spyOn(userRepository, 'findById').mockRejectedValue(new Error());

      await expect(userService.findOneById('1')).rejects.toThrowError(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });
});
