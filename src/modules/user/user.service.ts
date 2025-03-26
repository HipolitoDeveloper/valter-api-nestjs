import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {} from './user.validator';
import { hash } from '../../helper/hash.handler';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ERRORS } from '../../common/enum';
import {
  CurrentUser,
  UserControllerNamespace,
  UserRepositoryNamespace,
  UserServiceNamespace,
} from './user.type';
import CreateUserBody = UserControllerNamespace.CreateUserBody;
import UpdateUserBody = UserControllerNamespace.UpdateUserBody;
import User = UserRepositoryNamespace.User;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    user: CreateUserBody,
    currentUser?: CurrentUser,
  ): Promise<UserServiceNamespace.CreateResponse> {
    try {
      const createdUser = await this.userRepository.create({
        email: user.email.toLowerCase(),
        password: await hash(user.password),
        birthday: user.birthday,
        firstname: user.firstName,
        surname: user.surname,
        pantry: {
          connect: {
            id: '',
          },
        },
      });

      return {
        id: createdUser.id,
        firstName: createdUser.firstname,
        email: createdUser.email,
      };
    } catch (error) {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR, error);
    }
  }

  async update(
    user: UpdateUserBody,
  ): Promise<UserServiceNamespace.UpdateResponse> {
    try {
      const updatedUser = await this.userRepository.update(
        {
          email: user.email.toLowerCase(),
          password: await hash(user.password),
          birthday: user.birthday,
          firstname: user.firstName,
          surname: user.surname,
        },
        user.id,
      );

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstname,
        email: updatedUser.email,
      };
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }
  }

  async findOneById(
    userId: string,
  ): Promise<UserServiceNamespace.FindOneByIdResponse> {
    let user: User;

    try {
      user = await this.userRepository.findById(userId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!user) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      surname: user.surname,
      id: user.id,
      firstName: user.firstname,
      email: user.email,
    };
  }

  async findOneByEmail(
    email: string,
  ): Promise<UserServiceNamespace.FindOneByEmailResponse> {
    let user: User;

    try {
      user = await this.userRepository.findById(email);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!user) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      surname: user.surname,
      id: user.id,
      firstName: user.firstname,
      email: user.email,
    };
  }
}
