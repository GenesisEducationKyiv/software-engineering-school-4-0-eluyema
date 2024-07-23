import { Inject, Injectable } from "@nestjs/common";

import { RemoveSubscriptionApplication } from "./interfaces/remove-subscription.application.interface";
import { SubscriptionService } from "../domain/services/interfaces/subscription.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class RemoveSubscriptionApplicationImpl
  implements RemoveSubscriptionApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(email: string): Promise<void> {
    await this.subscriptionService.unsubscribe(email);
  }
}
