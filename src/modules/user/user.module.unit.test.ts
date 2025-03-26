import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { ExceptionHandler } from '../../common/handler/exception.handler';

describe('UserModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UserService', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
  });

  it('should provide UserController', () => {
    const userController = module.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should provide UserRepository', () => {
    const userRepository = module.get<UserRepository>(UserRepository);
    expect(userRepository).toBeDefined();
  });

  it('should provide ExceptionHandler', () => {
    const exceptionHandler = module.get<ExceptionHandler>(ExceptionHandler);
    expect(exceptionHandler).toBeDefined();
  });
});
