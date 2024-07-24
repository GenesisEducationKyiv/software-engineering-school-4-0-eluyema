import { Subscription } from "../entities/subscription.entity";

export interface SubscriptionRepository {
  create(email: string): Promise<Subscription>;
  findByEmail(email: string): Promise<Subscription | null>;
  findAll(): Promise<Subscription[]>;
}
