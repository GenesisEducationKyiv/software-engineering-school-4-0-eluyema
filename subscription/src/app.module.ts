import { Module } from '@nestjs/common';

import { CreateSubscriptionApplicationImpl } from './application/create-subscription.application';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionServiceImpl } from './domain/services/subscription.service';
import { AppConfigModule } from './infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from './infrastructure/config/app-config.service';
import { ExchangeRateNotificationService } from './infrastructure/notification/exchange-rate-notification.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PrismaSubscriptionRepositoryImpl } from './infrastructure/repositories/prisma-subscription.repository';
import { ExchangeRateCronServiceImpl } from './infrastructure/scheduling/exchange-rate-cron.service';
import { TYPES } from './ioc/types';

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
  useClass: ExchangeRateNotificationService,
};

const exchangeRateCronService = {
  provide: TYPES.infrastructure.ExchangeRateCronService,
  useClass: ExchangeRateCronServiceImpl,
};

@Module({
  imports: [PrismaModule, AppConfigModule],
  controllers: [SubscriptionController],
  providers: [
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
