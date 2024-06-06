import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { SubscriptionService } from '../domain/services/subscription.service';
import { CreateSubscriptionApplication } from '../interfaces/applications/create-subscription.application.interface';

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
