export interface SubscriptionService {
  subscribe(email: string): Promise<unknown>;
}
