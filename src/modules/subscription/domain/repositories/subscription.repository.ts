import { Subscription } from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  create(email: string): Promise<Subscription>;
  findByEmail(email: string): Promise<Subscription | null>;
  findAll(): Promise<Subscription[]>;
}
