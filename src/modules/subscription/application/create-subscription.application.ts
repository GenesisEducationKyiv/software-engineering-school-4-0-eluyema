import { Inject, Injectable } from '@nestjs/common';

import { CreateSubscriptionApplication } from './interfaces/create-subscription.application.interface';
import { SubscriptionService } from '../domain/services/interfaces/subscription.service.interface';
import { TYPES } from '../infrastructure/ioc/types';

@Injectable()
export class CreateSubscriptionApplicationImpl
  implements CreateSubscriptionApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(email: string): Promise<boolean> {
    return this.subscriptionService.create(email);
  }
}
