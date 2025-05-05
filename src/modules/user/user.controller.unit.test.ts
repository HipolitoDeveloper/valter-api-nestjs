import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mocks from '../../../test/mocks';
import { UserControllerNamespace } from './user.type';
import CreateUserBody = UserControllerNamespace.CreateUserBody;

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getProfile: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    changeState: jest.fn(),
  };

  let userMock: CreateUserBody;
  let requestMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);

    userMock = mocks.USER_MOCK.SERVICE.userMock;
    requestMock = {
      currentUser: mocks.USER_MOCK.currentUser,
    };
  });

  it('should create a user', async () => {
    mockUserService.create.mockResolvedValue(userMock);

    const result = await userController.create(requestMock, userMock);
    expect(result).toEqual(userMock);
    expect(mockUserService.create).toHaveBeenCalledWith(
      userMock,
    );
  });

  it('should find a user by ID', async () => {
    const userId = '1';
    const userMock = mocks.USER_MOCK.REPOSITORY.findById;
    mockUserService.findOneById.mockResolvedValue(userMock);

    const result = await userController.findOne(userId);
    expect(result).toEqual(userMock);
    expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
  });

  it('should update a user', async () => {
    mockUserService.update.mockResolvedValue(userMock);

    const result = await userController.update(userMock);
    expect(result).toEqual(userMock);
    expect(mockUserService.update).toHaveBeenCalledWith(userMock);
  });
});
