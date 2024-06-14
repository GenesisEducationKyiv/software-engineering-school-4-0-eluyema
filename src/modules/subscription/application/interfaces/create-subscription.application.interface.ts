export interface CreateSubscriptionApplication {
  execute(email: string): Promise<boolean>;
}
