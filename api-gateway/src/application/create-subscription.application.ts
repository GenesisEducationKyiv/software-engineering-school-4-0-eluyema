import { Inject, Injectable } from '@nestjs/common';

import { CreateSubscriptionApplication } from './interfaces/create-subscription.application.interface';
import { SubscriptionService } from '../infrastructure/http/interfaces/subscription.service.interface';
import { TYPES } from '../ioc/types';

@Injectable()
export class CreateSubscriptionApplicationImpl
  implements CreateSubscriptionApplication
{
  constructor(
    @Inject(TYPES.infrastructure.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(email: string): Promise<unknown> {
    return this.subscriptionService.subscribe(email);
  }
}
