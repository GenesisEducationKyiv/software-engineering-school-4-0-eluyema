import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { validateEnvironmentVars } from "./infrastructure/config/configuration";

async function bootstrap() {
  validateEnvironmentVars();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["kafka:9093"],
      },
      consumer: {
        groupId: "exchange-rate-consumer",
      },
    },
  });
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const port = configService.get("server.port");
  const host = configService.get("server.host");

  await app.startAllMicroservices();
  await app.listen(port, host);
  Logger.log(`Appplication started on port: ${port}`);
}
bootstrap();
