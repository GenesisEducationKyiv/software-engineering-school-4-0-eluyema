export interface CreateSubscriptionSagaOrchestratorApplication {
  execute(email: string): Promise<boolean>;
  onCustomerCreateFail(email: string): Promise<void>;
  onCustomerCreateSuccess(email: string): Promise<void>;
}
