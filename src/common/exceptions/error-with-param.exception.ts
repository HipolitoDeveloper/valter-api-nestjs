import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorWithParamException extends HttpException {
  constructor(message: string, param: any) {
    super({ message, param }, HttpStatus.BAD_REQUEST);
  }
}
