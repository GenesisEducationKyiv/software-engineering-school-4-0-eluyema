import { Inject, Injectable, Logger } from "@nestjs/common";

import { Subscription } from "src/domain/entities/subscription.entity";
import { SubscriptionService } from "src/domain/services/interfaces/subscription.service.interface";

import { RemoveRateSubscriptionApplication } from "./interfaces/remove-rate-subscription.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class RemoveRateSubscriptionApplicationImpl
  implements RemoveRateSubscriptionApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(subscription: Subscription): Promise<void> {
    try {
      this.logger.log(`Remove subscription ${subscription.email} started`);
      await this.subscriptionService.delete(subscription.email);
      this.logger.log(`Remove subscription ${subscription.email} success`);
    } catch (err) {
      this.logger.error(`Remove subscription ${subscription.email} failed`);
      throw err;
    }
  }
}
