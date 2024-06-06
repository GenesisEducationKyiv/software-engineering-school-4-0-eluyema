import { Module } from '@nestjs/common';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { ConfigModule } from '@nestjs/config';
import { TYPES } from './interfaces/types';
import { FetchExchangeRateApplicationImpl } from './application/fetch-exchange-rate.application';
import { ExchangeRateService } from './domain/services/exchange-rate.service';
import { ExchangeRateClientImpl } from './infrastructure/http/clients/exchange-rate.client';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateCronServiceImpl } from './infrastructure/scheduling/cron/exchange-rate-cron.service';
import { ExchangeRateEmailService } from './infrastructure/notification/email/exchange-rate-email.service';
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
  useClass: ExchangeRateEmailService,
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
