import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { validateEnvironmentVars } from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  validateEnvironmentVars();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.setGlobalPrefix('/api');
  const configService = app.get(ConfigService);

  const port = configService.get('server.port');
  const host = configService.get('server.host');

  await app.listen(port, host);
  Logger.log(`Appplication started on port: ${port}`);
}
bootstrap();
