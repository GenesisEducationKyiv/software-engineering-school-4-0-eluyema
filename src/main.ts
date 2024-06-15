import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { validateEnvironmentVars } from './shared/infrastructure/config/configuration';

async function bootstrap() {
  validateEnvironmentVars();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const port = configService.get('server.port');
  const host = configService.get('server.host');

  await app.listen(port, host);
  Logger.log(`Appplication started on port: ${port}`);
}
bootstrap();
