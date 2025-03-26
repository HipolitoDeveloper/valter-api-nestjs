import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

//TODO: Criar exception de integração e filter integração
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    console.log({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      stacktrace: exception.stack,
      details: exceptionResponse.details,
      incoming: JSON.stringify(request.body),
    });

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      // method: request.method,
      // stacktrace: exception.stack,
      param: exceptionResponse ? exceptionResponse.param : undefined,
      message: exception.message,
    });
  }
}
