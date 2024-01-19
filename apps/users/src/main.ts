/**
 * NestJS gRPC Microservices Starter Kit — Users Microservice
 *
 * @copyright © 2024 Oleg Dubnov
 * https://olegdubnov.com
 */

import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 5002;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: join(__dirname, '../proto/users.proto'),
      url: `${HOST}:${PORT}`,
    },
  });
  await app.listen().then(() => {
    console.log(`The Users gRPC Microservice is listening on: ${HOST}:${PORT}`);
  });
}
bootstrap();
