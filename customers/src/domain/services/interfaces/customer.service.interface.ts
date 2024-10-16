import { Customer } from "src/domain/entities/customer.entity";

export interface CustomerService {
  create(email: string): Promise<boolean>;
  remove(email: string): Promise<void>;
  getCustomers(): Promise<Customer[]>;
}
