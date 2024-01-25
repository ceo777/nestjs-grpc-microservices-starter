/**
 * NestJS gRPC Microservices Starter Kit — Tasks Microservice
 *
 * @copyright © 2024 Oleg Dubnov
 * https://olegdubnov.com
 */

import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Tasks Microservice');

async function bootstrap() {
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 5001;

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: 'tasks',
            protoPath: join(__dirname, '../proto/tasks.proto'),
            url: `${HOST}:${PORT}`,
        },
    });

  await app.listen().then(() => {
      logger.log(`Tasks gRPC Microservice is listening on: ${HOST}:${PORT}`);
  });
}

bootstrap();
