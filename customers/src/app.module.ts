import { randomUUID } from "crypto";

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";

import { CreateCustomerApplicationImpl } from "./application/create-customer.application";
import { RemoveCustomerApplicationImpl } from "./application/remove-customer.application";
import { CustomerController } from "./controller/customer.controller";
import { CustomerServiceImpl } from "./domain/services/customer.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { AppConfigService } from "./infrastructure/config/interfaces/app-config.service.interface";
import { KafkaMailerEventNotificationServiceImpl } from "./infrastructure/notification/kafka-mailer-event-notification.service";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { PrismaSubscriptionRepositoryImpl } from "./infrastructure/repositories/prisma-customer.repository";
import { TYPES } from "./ioc/types";

const createCustomerApp = {
  provide: TYPES.applications.CreateCustomerApplication,
  useClass: CreateCustomerApplicationImpl,
};

const removeCustomerApp = {
  provide: TYPES.applications.RemoveCustomerApplication,
  useClass: RemoveCustomerApplicationImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const customerService = {
  provide: TYPES.services.CustomerService,
  useClass: CustomerServiceImpl,
};

const customerRepository = {
  provide: TYPES.repositories.CustomerRepository,
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
  controllers: [CustomerController],
  providers: [
    createCustomerApp,
    removeCustomerApp,
    customerService,
    customerRepository,
    appConfigService,
    eventNotificationService,
  ],
  exports: [subscriptionService],
})
export class AppModule {}
