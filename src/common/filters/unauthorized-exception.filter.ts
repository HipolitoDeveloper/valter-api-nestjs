import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERRORS } from '../enum';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.UNAUTHORIZED;

    console.log({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      stacktrace: exception.stack,
      incoming: request.body,
    });

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      // stacktrace: exception.stack,
      message: ERRORS.UNAUTHORIZED,
    });
  }
}
