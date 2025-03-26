import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodIssue } from 'zod';

export class ZodException extends HttpException {
  constructor(zodErrors: ZodIssue[]) {
    const errorMessage = zodErrors
      .map((error) => {
        return `Field ${error.path.join('.')} ${error.message}.`;
      })
      .join(' ');

    super(`[Zod Error]: ${errorMessage}`, HttpStatus.BAD_REQUEST);
  }
}
