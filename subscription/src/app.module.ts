import { randomUUID } from "crypto";

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";

import { CreateSubscriptionSagaOrchestratorApplicationImpl } from "./application/create-subscription-saga-orchestrator.application";
import { RemoveSubscriptionSagaOrchestratorApplicationImpl } from "./application/remove-subscription-saga-orchestrator.application";
import { KafkaSubscriptionController } from "./controller/kafka-subscription.controller";
import { MetricsController } from "./controller/metrics.controller";
import { SubscriptionController } from "./controller/subscription.controller";
import { SubscriptionServiceImpl } from "./domain/services/subscription.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { AppConfigService } from "./infrastructure/config/interfaces/app-config.service.interface";
import { PrometheusMetricsServiceImpl } from "./infrastructure/metrics/metrics.service";
import { KafkaEventNotificationServiceImpl } from "./infrastructure/notification/kafka-event-notification.service";
import { PrismaService } from "./infrastructure/prisma/prisma.service";
import { PrismaSubscriptionRepositoryImpl } from "./infrastructure/repositories/prisma-subscription.repository";
import { TYPES } from "./ioc/types";

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionSagaOrchestratorApplication,
  useClass: CreateSubscriptionSagaOrchestratorApplicationImpl,
};

const removeSubscriptionApp = {
  provide: TYPES.applications.RemoveSubscriptionSagaOrchestratorApplication,
  useClass: RemoveSubscriptionSagaOrchestratorApplicationImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const subscriptionService = {
  provide: TYPES.services.SubscriptionService,
  useClass: SubscriptionServiceImpl,
};

const subscriptionRepository = {
  provide: TYPES.repositories.SubscriptionRepository,
  useClass: PrismaSubscriptionRepositoryImpl,
};

const eventCustomersNotificationService = {
  provide: TYPES.infrastructure.EventCustomersNotificationService,
  useFactory: (client) => {
    return new KafkaEventNotificationServiceImpl(client);
  },
  inject: [TYPES.brokers.Customers],
};

const eventMailerNotificationService = {
  provide: TYPES.infrastructure.EventMailerNotificationService,
  useFactory: (client) => {
    return new KafkaEventNotificationServiceImpl(client);
  },
  inject: [TYPES.brokers.Mailer],
};

const metricsService = {
  provide: TYPES.infrastructure.MetricsService,
  useClass: PrometheusMetricsServiceImpl,
};

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: TYPES.brokers.Mailer,
        useFactory: (appConfigService: AppConfigService) => {
          const brokerHost = appConfigService.messageBrokers.mailer.host;
          const brokerGroupId = appConfigService.messageBrokers.mailer.groupId;
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: "subscription-" + randomUUID(),
                brokers: [brokerHost],
              },
              consumer: {
                groupId: brokerGroupId,
              },
            },
          };
        },
        extraProviders: [appConfigService],
        inject: [appConfigService.provide],
      },
      {
        name: TYPES.brokers.Customers,
        useFactory: (appConfigService: AppConfigService) => {
          const brokerHost = appConfigService.messageBrokers.customers.host;
          const brokerGroupId =
            appConfigService.messageBrokers.customers.groupId;
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: "customers-" + randomUUID(),
                brokers: [brokerHost],
              },
              consumer: {
                groupId: brokerGroupId,
              },
            },
          };
        },
        extraProviders: [appConfigService],
        inject: [appConfigService.provide],
      },
    ]),
  ],
  controllers: [
    SubscriptionController,
    KafkaSubscriptionController,
    MetricsController,
  ],
  providers: [
    createSubscriptionApp,
    removeSubscriptionApp,
    subscriptionService,
    subscriptionRepository,
    appConfigService,
    eventCustomersNotificationService,
    eventMailerNotificationService,
    metricsService,
    PrismaService,
  ],
  exports: [subscriptionService],
})
export class AppModule {}
