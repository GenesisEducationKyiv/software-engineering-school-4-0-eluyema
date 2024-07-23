export interface RemoveSubscriptionApplication {
  execute(email: string): Promise<void>;
}
