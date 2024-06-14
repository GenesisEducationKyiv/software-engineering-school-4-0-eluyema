import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/shared/infrastructure/prisma/prisma.module';

import { CreateSubscriptionApplicationImpl } from './application/create-subscription.application';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionServiceImpl } from './domain/services/subscription.service';
import { TYPES } from './infrastructure/ioc/types';
import { PrismaSubscriptionRepositoryImpl } from './infrastructure/repositories/prisma-subscription.repository';

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionApplication,
  useClass: CreateSubscriptionApplicationImpl,
};

const subscriptionService = {
  provide: TYPES.services.SubscriptionService,
  useClass: SubscriptionServiceImpl,
};

const subscriptionRepository = {
  provide: TYPES.repositories.SubscriptionRepository,
  useClass: PrismaSubscriptionRepositoryImpl,
};

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionController],
  providers: [
    createSubscriptionApp,
    subscriptionService,
    subscriptionRepository,
  ],
  exports: [subscriptionService],
})
export class SubscriptionModule {}
