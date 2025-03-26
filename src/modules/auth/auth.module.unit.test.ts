import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';

describe('AuthModule', () => {
  let authService: AuthService;
  let authController: AuthController;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(authController).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should provide AuthService', () => {
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should provide AuthController', () => {
    expect(authController).toBeInstanceOf(AuthController);
  });

  it('should provide JwtService', () => {
    expect(jwtService).toBeInstanceOf(JwtService);
  });

  it('should provide UserService', () => {
    expect(userService).toBeInstanceOf(UserService);
  });
});
