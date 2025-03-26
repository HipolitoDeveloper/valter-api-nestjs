import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(message: string, details?: string) {
    super({ message, details }, HttpStatus.BAD_REQUEST);
  }
}
