import { SubscriptionStatus } from "src/domain/entities/subscription.entity";

export interface SubscriptionService {
  create(email: string): Promise<boolean>;
  unsubscribe(email: string): Promise<void>;
  getSubscribers(): Promise<string[]>;
  updateStatus(email: string, status: SubscriptionStatus): Promise<void>;
}
