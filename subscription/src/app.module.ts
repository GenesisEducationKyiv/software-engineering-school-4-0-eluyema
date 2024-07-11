import { randomUUID } from "crypto";

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";

import { CreateSubscriptionApplicationImpl } from "./application/create-subscription.application";
import { RemoveSubscriptionApplicationImpl } from "./application/remove-subscription.application";
import { SubscriptionController } from "./controller/subscription.controller";
import { SubscriptionServiceImpl } from "./domain/services/subscription.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { AppConfigService } from "./infrastructure/config/interfaces/app-config.service.interface";
import { KafkaMailerEventNotificationServiceImpl } from "./infrastructure/notification/kafka-mailer-event-notification.service";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { PrismaSubscriptionRepositoryImpl } from "./infrastructure/repositories/prisma-subscription.repository";
import { TYPES } from "./ioc/types";

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionApplication,
  useClass: CreateSubscriptionApplicationImpl,
};

const removeSubscriptionApp = {
  provide: TYPES.applications.RemoveSubscriptionApplication,
  useClass: RemoveSubscriptionApplicationImpl,
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

const eventNotificationService = {
  provide: TYPES.infrastructure.EventNotificationService,
  useClass: KafkaMailerEventNotificationServiceImpl,
};

@Module({
  imports: [
    PrismaModule,
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
                clientId: "mailer-" + randomUUID(),
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
  controllers: [SubscriptionController],
  providers: [
    createSubscriptionApp,
    removeSubscriptionApp,
    subscriptionService,
    subscriptionRepository,
    appConfigService,
    eventNotificationService,
  ],
  exports: [subscriptionService],
})
export class AppModule {}
