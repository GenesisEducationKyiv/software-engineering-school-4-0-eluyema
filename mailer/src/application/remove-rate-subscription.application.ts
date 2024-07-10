import { Inject, Injectable } from "@nestjs/common";

import { Subscription } from "src/domain/entities/subscription.entity";
import { SubscriptionService } from "src/domain/services/interfaces/subscription.service.interface";

import { RemoveRateSubscriptionApplication } from "./interfaces/remove-rate-subscription.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class RemoveRateSubscriptionApplicationImpl
  implements RemoveRateSubscriptionApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(subscription: Subscription): Promise<void> {
    await this.subscriptionService.delete(subscription.email);
  }
}
