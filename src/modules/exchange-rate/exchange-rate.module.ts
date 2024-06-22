import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc/types';

import { FetchExchangeRateApplicationImpl } from './application/fetch-exchange-rate.application';
import { SendExchangeRateToSubscribersApplicationImpl } from './application/send-exchange-rate-to-subscribers.application';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { BaseExchangeRateService } from './domain/services/exchange-rate.service';
import { BankgovClientImpl } from './infrastructure/http/clients/bankgov.client';
import { OpenexchangeratesClientImpl } from './infrastructure/http/clients/openexchangerates.client';
import { TYPES } from './infrastructure/ioc';
import { ExchangeRateNotificationServiceImpl } from './infrastructure/notification/exchange-rate-email.service';
import { ExchangeRateCronServiceImpl } from './infrastructure/scheduling/exchange-rate-cron.service';
import { ExchangeRateEmailComposerServiceImpl } from '../mailer/infrastructure/email/composers/exchange-rate-email-composer.service';
import { MailerModule } from '../mailer/mailer.module';
import { SubscriptionModule } from '../subscription/subscription.module';

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
  useClass: OpenexchangeratesClientImpl,
};

const bankgovClient = {
  provide: TYPES.infrastructure.BankgovClient,
  useClass: BankgovClientImpl,
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

const appConfigService = {
  provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useFactory: (...services: BaseExchangeRateService[]) => {
    return BaseExchangeRateService.chainServices(services);
  },
  // important: order is matter!
  inject: [openexchangeratesClient.provide, bankgovClient.provide],
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
    exchangeRateService,
  ],
})
export class ExchangeRateModule {}
