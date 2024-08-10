export interface SubscriptionService {
  subscribe(email: string): Promise<unknown>;
  unsubscribe(email: string): Promise<unknown>;
}
