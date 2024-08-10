export interface CreateSubscriptionApplication {
  execute(email: string): Promise<unknown>;
}
