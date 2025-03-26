import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, ExceptionHandler],
  exports: [UserRepository],
})
export class UserModule {}
