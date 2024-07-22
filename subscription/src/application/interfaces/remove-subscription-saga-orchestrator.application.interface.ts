export interface RemoveSubscriptionSagaOrchestratorApplication {
  execute(email: string): Promise<void>;
  onCustomerRemoveFail(email: string): Promise<void>;
  onCustomerRemoveSuccess(email: string): Promise<void>;
}
