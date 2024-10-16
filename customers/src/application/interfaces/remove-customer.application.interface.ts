export interface RemoveCustomerApplication {
  execute(email: string): Promise<void>;
}
