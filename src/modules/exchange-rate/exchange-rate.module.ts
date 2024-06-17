import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc/types';

import { FetchExchangeRateApplicationImpl } from './application/fetch-exchange-rate.application';
import { SendExchangeRateToSubscribersApplicationImpl } from './application/send-exchange-rate-to-subscribers.application';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { ExchangeRateServiceImpl } from './domain/services/exchange-rate.service';
import { ExchangeRateClientImpl } from './infrastructure/http/clients/exchange-rate.client';
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

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const exchangeRateClient = {
  provide: TYPES.infrastructure.ExchangeRateClient,
  useClass: ExchangeRateClientImpl,
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
    exchangeRateService,
    exchangeRateClient,
    emailComposerService,
    exchangeRateNotificationService,
    exchangeRateCronService,
    sendExchangeRateToSubscribersApp,
    appConfigService,
  ],
})
export class ExchangeRateModule {}
