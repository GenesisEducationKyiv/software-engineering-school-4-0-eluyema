export interface SubscriptionService {
  create(email: string): Promise<boolean>;
  unsubscribe(email: string): Promise<void>;
  getSubscribers(): Promise<string[]>;
}
