import { Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaException } from '../exceptions/prisma.exception';
import { ErrorException } from '../exceptions/error.exception';

@Injectable()
export class ExceptionHandler {
  constructor() {}

  handleException(error: any) {
    if (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientValidationError
    ) {
      throw new PrismaException(error);
    }

    if (error) {
      throw new ErrorException(error.message);
    }
  }
}
