import { Subscription } from "src/domain/entities/subscription.entity";

export interface RemoveRateSubscriptionApplication {
  execute(subscription: Subscription): Promise<void>;
}
