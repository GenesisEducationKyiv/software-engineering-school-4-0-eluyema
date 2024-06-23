import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { AppConfigService } from 'src/shared/infrastructure/config/interfaces/app-config.service.interface';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc/types';

import { FetchExchangeRateApplicationImpl } from './application/fetch-exchange-rate.application';
import { SendExchangeRateToSubscribersApplicationImpl } from './application/send-exchange-rate-to-subscribers.application';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { BaseExchangeRateService } from './domain/services/exchange-rate.service';
import { BankgovClientImpl } from './infrastructure/http/clients/bankgov.client';
import { LoggingExchangeRateServiceDecorator } from './infrastructure/http/clients/logging-exchange-rate.decorator';
import { OpenexchangeratesClientImpl } from './infrastructure/http/clients/openexchangerates.client';
import { PrivatbankClientImpl } from './infrastructure/http/clients/privatbank.client';
import { TYPES } from './infrastructure/ioc';
import { ExchangeRateNotificationServiceImpl } from './infrastructure/notification/exchange-rate-email.service';
import { ExchangeRateCronServiceImpl } from './infrastructure/scheduling/exchange-rate-cron.service';
import { ExchangeRateEmailComposerServiceImpl } from '../mailer/infrastructure/email/composers/exchange-rate-email-composer.service';
import { MailerModule } from '../mailer/mailer.module';
import { SubscriptionModule } from '../subscription/subscription.module';

const appConfigService = {
  provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
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

const openexchangeratesClient = {
  provide: TYPES.infrastructure.OpenexchangeratesClient,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
  ) => {
    const client = new OpenexchangeratesClientImpl(
      httpService,
      appConfigService,
    );
    return new LoggingExchangeRateServiceDecorator(
      client,
      'openexchangerates.org',
    );
  },
  inject: [appConfigService.provide, HttpService],
};

const bankgovClient = {
  provide: TYPES.infrastructure.BankgovClient,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
  ) => {
    const client = new BankgovClientImpl(httpService, appConfigService);
    return new LoggingExchangeRateServiceDecorator(client, 'bank.gov.ua');
  },
  inject: [appConfigService.provide, HttpService],
};

const privatbankClient = {
  provide: TYPES.infrastructure.PrivatbankClient,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
  ) => {
    const client = new PrivatbankClientImpl(httpService, appConfigService);
    return new LoggingExchangeRateServiceDecorator(client, 'api.privatbank.ua');
  },
  inject: [appConfigService.provide, HttpService],
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useFactory: (...services: BaseExchangeRateService[]) => {
    return BaseExchangeRateService.chainServices(services);
  },
  // important: order is matter!
  inject: [
    bankgovClient.provide,
    openexchangeratesClient.provide,
    privatbankClient.provide,
  ],
};

const exchangeRateNotificationService = {
  provide: TYPES.infrastructure.ExchangeRateNotificationService,
  useClass: ExchangeRateNotificationServiceImpl,
};

const exchangeRateCronService = {
  provide: TYPES.infrastructure.ExchangeRateCronService,
  useClass: ExchangeRateCronServiceImpl,
};

const emailComposerService = {
  provide: TYPES.infrastructure.ExchangeRateEmailComposerService,
  useClass: ExchangeRateEmailComposerServiceImpl,
};

@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    HttpModule,
    MailerModule,
    SubscriptionModule,
  ],
  controllers: [ExchangeRateController],
  providers: [
    fetchExchangeRateApp,
    emailComposerService,
    exchangeRateNotificationService,
    exchangeRateCronService,
    sendExchangeRateToSubscribersApp,
    appConfigService,
    openexchangeratesClient,
    bankgovClient,
    privatbankClient,
    exchangeRateService,
  ],
})
export class ExchangeRateModule {}
