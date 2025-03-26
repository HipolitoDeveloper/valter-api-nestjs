import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

export class PrismaException extends HttpException {
  constructor(prismaError: PrismaClientValidationError) {
    super(`[Prisma Error]: ${prismaError.message}`, HttpStatus.BAD_REQUEST);
  }
}
