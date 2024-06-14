import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FetchExchangeRateApplicationImpl } from './application/fetch-exchange-rate.application';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { ExchangeRateService } from './domain/services/exchange-rate.service';
import { ExchangeRateClientImpl } from './infrastructure/http/clients/exchange-rate.client';
import { TYPES } from './infrastructure/ioc/types';
import { ExchangeRateEmailServiceImpl } from './infrastructure/notification/exchange-rate-email.service';
import { ExchangeRateCronServiceImpl } from './infrastructure/scheduling/exchange-rate-cron.service';
import { MailerModule } from '../mailer/mailer.module';
import { SubscriptionModule } from '../subscription/subscription.module';

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateService,
};

const exchangeRateClient = {
  provide: TYPES.clients.ExchangeRateClient,
  useClass: ExchangeRateClientImpl,
};

const exchangeRateNotificationService = {
  provide: TYPES.notification.ExchangeRateNotificationService,
  useClass: ExchangeRateEmailServiceImpl,
};

const exchangeRateCronService = {
  provide: TYPES.cron.ExchangeRateCronService,
  useClass: ExchangeRateCronServiceImpl,
};

@Module({
  imports: [ConfigModule, HttpModule, MailerModule, SubscriptionModule],
  controllers: [ExchangeRateController],
  providers: [
    fetchExchangeRateApp,
    exchangeRateService,
    exchangeRateClient,
    exchangeRateNotificationService,
    exchangeRateCronService,
  ],
})
export class ExchangeRateModule {}
