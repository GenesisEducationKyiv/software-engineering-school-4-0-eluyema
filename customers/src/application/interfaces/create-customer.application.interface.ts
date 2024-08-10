export interface CreateCustomerApplication {
  execute(email: string): Promise<boolean>;
}
