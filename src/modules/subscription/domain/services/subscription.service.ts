import { Inject, Injectable } from '@nestjs/common';

import { TYPES } from '../../interfaces/types';
import { Subscription } from '../entities/subscription.entity';
import { ISubscriptionRepository } from '../repositories/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(TYPES.repositories.SubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async create(email: string): Promise<boolean> {
    const existingSubscription =
      await this.subscriptionRepository.findByEmail(email);
    if (!existingSubscription) {
      await this.subscriptionRepository.create(email);
      return true;
    }
    return false;
  }

  async getSubscribers(): Promise<string[]> {
    const subscriptions: Subscription[] =
      await this.subscriptionRepository.findAll();

    const subscribers = subscriptions.map((subscription) => subscription.email);

    return subscribers;
  }
}
