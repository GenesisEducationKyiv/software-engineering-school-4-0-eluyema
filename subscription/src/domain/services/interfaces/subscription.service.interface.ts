export interface SubscriptionService {
  create(email: string): Promise<boolean>;

  getSubscribers(): Promise<string[]>;
}
