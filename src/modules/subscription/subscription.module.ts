import { Module } from '@nestjs/common';
import { SubscriptionController } from './controller/subscription.controller';
import { TYPES } from './interfaces/types';
import { CreateSubscriptionApplicationImpl } from './application/create-subscription.application';
import { SubscriptionService } from './domain/services/subscription.service';
import { PrismaSubscriptionRepository } from './infrastructure/prisma/repositories/prisma-subscription.repository';
import { PrismaModule } from 'src/shared/infrastructure/prisma/prisma.module';

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionApplication,
  useClass: CreateSubscriptionApplicationImpl,
};

const subscriptionService = {
  provide: TYPES.services.SubscriptionService,
  useClass: SubscriptionService,
};

const subscriptionRepository = {
  provide: TYPES.repositories.SubscriptionRepository,
  useClass: PrismaSubscriptionRepository,
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
