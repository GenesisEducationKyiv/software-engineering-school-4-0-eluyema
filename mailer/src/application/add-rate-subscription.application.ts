import { Inject, Injectable, Logger } from "@nestjs/common";

import { Subscription } from "src/domain/entities/subscription.entity";
import { SubscriptionService } from "src/domain/services/interfaces/subscription.service.interface";

import { AddRateSubscriptionApplication } from "./interfaces/add-rate-subscription.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class AddRateSubscriptionApplicationImpl
  implements AddRateSubscriptionApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(subscription: Subscription): Promise<void> {
    try {
      this.logger.log("Subscription creation started");
      await this.subscriptionService.create(subscription.email);
    } catch (err) {
      this.logger.error("Subscription creation failed! Error: " + err.message);
      throw err;
    }
  }
}
