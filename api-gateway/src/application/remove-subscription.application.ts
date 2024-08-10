import { Inject, Injectable } from "@nestjs/common";

import { SubscriptionService } from "src/infrastructure/http/interfaces/subscription.service.interface";

import { RemoveSubscriptionApplication } from "./interfaces/remove-subscription.application.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class RemoveSubscriptionApplicationImpl
  implements RemoveSubscriptionApplication
{
  constructor(
    @Inject(TYPES.infrastructure.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async execute(email: string): Promise<unknown> {
    return await this.subscriptionService.unsubscribe(email);
  }
}
