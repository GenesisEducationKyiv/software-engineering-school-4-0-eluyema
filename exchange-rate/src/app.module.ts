import { randomUUID } from "crypto";

import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { FetchExchangeRateApplicationImpl } from "./application/fetch-exchange-rate.application";
import { SendExchangeRateToSubscribersApplicationImpl } from "./application/send-exchange-rate-to-subscribers.application";
import { HttpExchangeRateController } from "./controller/http-exchange-rate.controller";
import { KafkaExchangeRateController } from "./controller/kafka-exchange-rate.controller";
import { ExchangeRateServiceImpl } from "./domain/services/exchange-rate.service";
import { ExchangeRateClient } from "./domain/services/interfaces/exchange-rate.client.interface";
import { ExchangeRateEmailComposerServiceImpl } from "./infrastructure/composers/exchange-rate-email-composer.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { AppConfigService } from "./infrastructure/config/interfaces/app-config.service.interface";
import { BankgovClientImpl } from "./infrastructure/http/clients/bankgov.client";
import { LoggingExchangeRateServiceDecorator } from "./infrastructure/http/clients/logging-exchange-rate.decorator";
import { OpenexchangeratesClientImpl } from "./infrastructure/http/clients/openexchangerates.client";
import { PrivatbankClientImpl } from "./infrastructure/http/clients/privatbank.client";
import { ExchangeRateNotificationServiceImpl } from "./infrastructure/notification/exchange-rate-email.service";
import { KafkaMailerServiceImpl } from "./infrastructure/notification/kafka-mailer.service";
import { HandlebarsTemplateServiceImpl } from "./infrastructure/template/template.service";
import { TYPES } from "./ioc";

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const sendExchangeRateToSubscribersApp = {
  provide: TYPES.applications.SendExchangeRateToSubscribersApplication,
  useClass: SendExchangeRateToSubscribersApplicationImpl,
};

const exchangeRateClients = {
  provide: TYPES.infrastructure.ExchangeRateClients,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
  ) => {
    const clientsMap = new Map<string, ExchangeRateClient>();

    clientsMap.set(
      "bank.gov.ua",
      new BankgovClientImpl(httpService, appConfigService),
    );
    clientsMap.set(
      "openexchangerates.org",
      new OpenexchangeratesClientImpl(httpService, appConfigService),
    );
    clientsMap.set(
      "api.privatbank.ua",
      new PrivatbankClientImpl(httpService, appConfigService),
    );

    return [...clientsMap].map(
      ([name, instance]) =>
        new LoggingExchangeRateServiceDecorator(instance, name),
    );
  },
  inject: [appConfigService.provide, HttpService],
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const exchangeRateNotificationService = {
  provide: TYPES.infrastructure.ExchangeRateNotificationService,
  useClass: ExchangeRateNotificationServiceImpl,
};

const emailComposerService = {
  provide: TYPES.infrastructure.ExchangeRateEmailComposerService,
  useClass: ExchangeRateEmailComposerServiceImpl,
};

const mailerService = {
  provide: TYPES.services.EmailService,
  useClass: KafkaMailerServiceImpl,
};

const templateService = {
  provide: TYPES.services.TemplateService,
  useClass: HandlebarsTemplateServiceImpl,
};

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    HttpModule,
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
  controllers: [HttpExchangeRateController, KafkaExchangeRateController],
  providers: [
    fetchExchangeRateApp,
    emailComposerService,
    exchangeRateNotificationService,
    sendExchangeRateToSubscribersApp,
    appConfigService,
    exchangeRateClients,
    exchangeRateService,
    mailerService,
    templateService,
  ],
})
export class AppModule {}
