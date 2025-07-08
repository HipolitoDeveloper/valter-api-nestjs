import { Test, TestingModule } from '@nestjs/testing';
import { hash } from '../../helper/hash.handler';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ERRORS, PROFILES } from '../../common/enum';
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
    let userCreatedMock: UserRepositoryNamespace.User;

    beforeEach(() => {
      userMock = mocks.USER_MOCK.SERVICE.userMock;
      userCreateMock = mocks.USER_MOCK.REPOSITORY.create;
      userCreatedMock = mocks.USER_MOCK.REPOSITORY.findByEmail;
      (hash as jest.Mock).mockResolvedValue(userMock.password);
    });

    it('should create a user successfully', async () => {
      jest.spyOn(userRepository, 'create').mockResolvedValue(userCreateMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(undefined);

      const result = await userService.create(userMock);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: userMock.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: userMock.password,
        firstname: userMock.firstName,
        surname: userMock.surname,
        birthday: userMock.birthday,
        pantry: {
          create: {
            name: userMock.pantryName,
          },
        },
        profile: {
          connect: {
            name: PROFILES.USER,
          },
        },
      } as typeof userMock);
      expect(result).toEqual({
        id: userCreateMock.id,
        firstName: userCreateMock.firstname,
        email: userCreateMock.email,
        surname: userCreateMock.surname,
        pantry: {
          name: userCreateMock.pantry.name,
        },
      });
    });

    it('should throw `ALREADY_CREATED_USER` if creation fails', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(userCreatedMock);

      await expect(userService.create(userMock)).rejects.toThrowError(
        new ErrorException(ERRORS.CUSTOM_ERROR.USER.ALREADY_CREATED_USER),
      );
    });

    it('should throw `CREATE_ENTITY_ERROR` if creation fails', async () => {
      jest.spyOn(userRepository, 'create').mockRejectedValue(new Error());
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(undefined);
      await expect(userService.create(userMock)).rejects.toThrowError(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });
  });

  describe('update', () => {
    let userMock: UserControllerNamespace.UpdateUserBody;
    let userUpdateMock: UserRepositoryNamespace.User;
    let existingUserMock: UserRepositoryNamespace.User;

    beforeEach(() => {
      userMock = mocks.USER_MOCK.SERVICE.userMock;
      userUpdateMock = mocks.USER_MOCK.REPOSITORY.update;
      existingUserMock = mocks.USER_MOCK.REPOSITORY.findByEmail;

      (hash as jest.Mock).mockResolvedValue(userMock.password);
    });

    it('should update a user successfully', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(userUpdateMock);
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(existingUserMock);

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
        pantry: {
          name: 'Pantry name',
        },
        surname: 'manchester apagar',
      });
    });

    it('should throw `NOT_FOUND_ENTITY` if any user is found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(undefined);
      await expect(userService.update(userMock)).rejects.toThrowError(
        new ErrorException(ERRORS.NOT_FOUND_ENTITY),
      );
    });

    it('should throw `UPDATE_ENTITY_ERROR` if update fails', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(existingUserMock);

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
        pantry: {
          id: userFindByIdMock.pantry.id,
          name: userFindByIdMock.pantry.name,
        },
        shoplist: {
          id: userFindByIdMock.pantry.shoplist.id,
          name: userFindByIdMock.pantry.shoplist.name,
        },
        resources: {
          'resource name': {
            create: true,
          },
        },
      });
    });

    it('should throw `DATABASE_ERROR` if repository fails', async () => {
      jest.spyOn(userRepository, 'findById').mockRejectedValue(new Error());

      await expect(userService.findOneById('1')).rejects.toThrowError(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });

  describe('findOneByEmail', () => {
    let userFindByEmailMock: UserRepositoryNamespace.User;

    beforeAll(() => {
      userFindByEmailMock = mocks.USER_MOCK.REPOSITORY.findByEmail;
    });

    it('should return a user by ID', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(userFindByEmailMock);

      const result = await userService.findOneByEmail('1');

      expect(userRepository.findByEmail).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: userFindByEmailMock.id,
        firstName: userFindByEmailMock.firstname,
        surname: userFindByEmailMock.surname,
        email: userFindByEmailMock.email,
        pantry: {
          name: userFindByEmailMock.pantry.name,
          id: userFindByEmailMock.pantry.id,
        },
        password: '',
      });
    });

    it('should throw `DATABASE_ERROR` if repository fails', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockRejectedValue(new Error());

      await expect(userService.findOneByEmail('1')).rejects.toThrowError(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });
});
