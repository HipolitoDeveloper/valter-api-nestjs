import { Module } from '@nestjs/common';
import { BasicStrategy } from '../../common/guards/strategies/basic.strategy';
import { JwtStrategy } from '../../common/guards/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../common/guards/strategies/jwt-refresh.strategy';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ExceptionHandler,
    UserService,
    BasicStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    UserRepository,
    ConfigService,
    AuthRepository,
  ],
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      // secret:
      //   process.env.JWT_SECRET ||
      //   'ccba9db2669a647f3b25d3917445f8a9cd1ce2a7b6c640540c09b9fb3b4eb87b',
    }),
  ],
  exports: [AuthModule],
})
export class AuthModule {}
