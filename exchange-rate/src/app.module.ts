import { randomUUID } from "crypto";

import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";

import { FetchExchangeRateApplicationImpl } from "./application/fetch-exchange-rate.application";
import { NotifyCurrentExchangeRateApplicationImpl } from "./application/notify-current-exchange-rate.application";
import { HttpExchangeRateController } from "./controller/http-exchange-rate.controller";
import { MetricsController } from "./controller/metrics.controller";
import { ExchangeRateServiceImpl } from "./domain/services/exchange-rate.service";
import { ExchangeRateClient } from "./domain/services/interfaces/exchange-rate.client.interface";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { AppConfigService } from "./infrastructure/config/interfaces/app-config.service.interface";
import { BankgovClientImpl } from "./infrastructure/http/clients/bankgov.client";
import { LoggingExchangeRateServiceDecorator } from "./infrastructure/http/clients/logging-exchange-rate.decorator";
import { OpenexchangeratesClientImpl } from "./infrastructure/http/clients/openexchangerates.client";
import { PrivatbankClientImpl } from "./infrastructure/http/clients/privatbank.client";
import { MetricsService } from "./infrastructure/metrics/interfaces/metrics.service.interface";
import { PrometheusMetricsServiceImpl } from "./infrastructure/metrics/metrics.service";
import { KafkaEventNotificationServiceImpl } from "./infrastructure/notification/kafka-event-notifier.service";
import { CurrentRateCronServiceImpl } from "./infrastructure/scheduling/current-rate-cron.service";
import { TYPES } from "./ioc";

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const notifyCurrentExchangeRateApplication = {
  provide: TYPES.applications.NotifyCurrentExchangeRateApplication,
  useClass: NotifyCurrentExchangeRateApplicationImpl,
};

const metricsService = {
  provide: TYPES.infrastructure.MetricsService,
  useClass: PrometheusMetricsServiceImpl,
};

const exchangeRateClients = {
  provide: TYPES.infrastructure.ExchangeRateClients,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
    metricsService: MetricsService,
  ) => {
    const clientsMap = new Map<string, ExchangeRateClient>();

    clientsMap.set(
      "bank.gov.ua",
      new BankgovClientImpl(httpService, appConfigService, metricsService),
    );
    clientsMap.set(
      "openexchangerates.org",
      new OpenexchangeratesClientImpl(
        httpService,
        appConfigService,
        metricsService,
      ),
    );
    clientsMap.set(
      "api.privatbank.ua",
      new PrivatbankClientImpl(httpService, appConfigService, metricsService),
    );

    return [...clientsMap].map(
      ([name, instance]) =>
        new LoggingExchangeRateServiceDecorator(instance, name),
    );
  },
  inject: [appConfigService.provide, HttpService, metricsService.provide],
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const eventNotificationService = {
  provide: TYPES.infrastructure.EventNotificationService,
  useClass: KafkaEventNotificationServiceImpl,
};

const currentRateCronService = {
  provide: TYPES.infrastructure.CurrentRateCronService,
  useClass: CurrentRateCronServiceImpl,
};

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    HttpModule,
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
  controllers: [HttpExchangeRateController, MetricsController],
  providers: [
    fetchExchangeRateApp,
    notifyCurrentExchangeRateApplication,
    appConfigService,
    exchangeRateClients,
    exchangeRateService,
    eventNotificationService,
    currentRateCronService,
    metricsService,
  ],
})
export class AppModule {}
