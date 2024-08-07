import { Inject, Injectable } from "@nestjs/common";

import { SubscriptionService } from "./interfaces/subscription.service.interface";
import { TYPES } from "../../ioc/types";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionRepository } from "../repositories/subscription.repository";

@Injectable()
export class SubscriptionServiceImpl implements SubscriptionService {
  constructor(
    @Inject(TYPES.repositories.SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(email: string): Promise<boolean> {
    const existingSubscription =
      await this.subscriptionRepository.findByEmail(email);
    if (existingSubscription) {
      return false;
    }
    await this.subscriptionRepository.create(email);
    return true;
  }

  async getSubscribers(): Promise<string[]> {
    const subscriptions: Subscription[] =
      await this.subscriptionRepository.findAll();

    const subscribers = subscriptions.map((subscription) => subscription.email);

    return subscribers;
  }
}
