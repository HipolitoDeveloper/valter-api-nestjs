import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaException } from '../exceptions/prisma.exception';

@Catch(PrismaException)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(
      `[ERROR]: ${JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
        path: request.url,
      })}`,
    );
    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
    });
  }
}
