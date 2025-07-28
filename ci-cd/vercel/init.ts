import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { AppModule } from '../../src/app.module';

const fastifyInstance = fastify();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance as any),
  );
  await app.init();
  await fastifyInstance.ready();
}

const bootstrapPromise = bootstrap();

export default async function handler(req, res) {
  await bootstrapPromise;
  fastifyInstance.server.emit('request', req, res);
}
