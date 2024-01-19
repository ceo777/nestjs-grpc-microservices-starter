/**
 * NestJS gRPC Microservices Starter Kit — API Gateway
 *
 * @copyright © 2024 Oleg Dubnov
 * https://olegdubnov.com
 */

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
  );

  await app.listen(PORT, HOST).then(() => {
    console.log(`The API Gateway is listening on: ${HOST}:${PORT}`);
  });
}

bootstrap();
