import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";

import { CreateSubscriptionApplicationImpl } from "./application/create-subscription.application";
import { TriggerSendExchangeRateNotificationApplicationImpl } from "./application/trigger-send-exchange-rate-notification.interface";
import { SubscriptionController } from "./controller/subscription.controller";
import { SubscriptionServiceImpl } from "./domain/services/subscription.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { KafkaExchangeRateNotificationService } from "./infrastructure/notification/kafka-exchange-rate-notification.service";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { PrismaSubscriptionRepositoryImpl } from "./infrastructure/repositories/prisma-subscription.repository";
import { ExchangeRateCronServiceImpl } from "./infrastructure/scheduling/exchange-rate-cron.service";
import { TYPES } from "./ioc/types";

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionApplication,
  useClass: CreateSubscriptionApplicationImpl,
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

const notificationService = {
  provide: TYPES.infrastructure.NotificationService,
  useClass: KafkaExchangeRateNotificationService,
};

const exchangeRateCronService = {
  provide: TYPES.infrastructure.ExchangeRateCronService,
  useClass: ExchangeRateCronServiceImpl,
};

const triggerSendExchangeRateNotificationApp = {
  provide: TYPES.applications.TriggerSendExchangeRateNotificationApplication,
  useClass: TriggerSendExchangeRateNotificationApplicationImpl,
};

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: "exchange-rate-microservice",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "client-exchange-rate",
            brokers: ["kafka:9093"],
          },
          consumer: {
            groupId: "exchange-rate-consumer",
          },
        },
      },
    ]),
    AppConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [SubscriptionController],
  providers: [
    triggerSendExchangeRateNotificationApp,
    createSubscriptionApp,
    subscriptionService,
    subscriptionRepository,
    appConfigService,
    notificationService,
    exchangeRateCronService,
  ],
  exports: [subscriptionService],
})
export class AppModule {}
