import { Subscription } from "src/domain/entities/subscription.entity";

export interface AddRateSubscriptionApplication {
  execute(subscription: Subscription): Promise<void>;
}
