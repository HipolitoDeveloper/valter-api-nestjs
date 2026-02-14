import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { AppModule } from './app.module';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/notfound-exception.filter';
import { NotificationExpiresService } from './modules/notification/notification-expires/notification-expires.service';
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  ScheduledEvent,
} from 'aws-lambda';

const fastifyInstance = fastify();

let app: NestFastifyApplication;
let bootstrapPromise: Promise<void> | null = null;

async function bootstrap(): Promise<void> {
  app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance as any),
    { logger: ['error', 'warn'] },
  );

  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({ origin: '*' });

  await app.init();
  await fastifyInstance.ready();
}

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  await bootstrapPromise;

  context.callbackWaitsForEmptyEventLoop = false;

  const path = event.rawPath || '/';
  const query = event.rawQueryString ? `?${event.rawQueryString}` : '';
  const url = `${path}${query}`;

  let payload: string | Buffer | undefined;
  if (event.body) {
    payload = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;
  }

  const response = await fastifyInstance.inject({
    method: (event.requestContext?.http?.method || 'GET') as any,
    url,
    headers: event.headers as Record<string, string>,
    payload,
  });

  const contentType = (response.headers['content-type'] as string) || '';
  const isTextual =
    contentType.includes('json') ||
    contentType.includes('text') ||
    contentType.includes('xml') ||
    contentType.includes('javascript') ||
    contentType.includes('html');

  return {
    statusCode: response.statusCode,
    headers: response.headers as Record<string, string>,
    body: isTextual
      ? response.body
      : Buffer.from(response.rawPayload).toString('base64'),
    isBase64Encoded: !isTextual,
  };
}

export async function cronHandler(
  event: ScheduledEvent,
  context: Context,
): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  await bootstrapPromise;

  context.callbackWaitsForEmptyEventLoop = false;

  const service = app.get(NotificationExpiresService);
  await service.callNotificationsExpires();
}
