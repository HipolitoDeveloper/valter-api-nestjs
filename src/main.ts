import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/notfound-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: '*',
  });
  app.enableShutdownHooks();
  // app.register(new LoggerMiddleware());
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
