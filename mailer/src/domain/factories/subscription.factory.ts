import { Injectable } from "@nestjs/common";

import { Subscription } from "../entities/subscription.entity";

@Injectable()
export class SubscriptionFactory {
  static create(data: { email: string }): Subscription {
    return new Subscription(data.email);
  }
}
