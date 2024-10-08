export interface SubscriptionService {
  create(email: string): Promise<boolean>;

  delete(email: string): Promise<void>;

  getSubscribers(): Promise<string[]>;
}
