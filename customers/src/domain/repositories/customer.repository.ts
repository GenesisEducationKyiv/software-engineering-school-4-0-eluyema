import { Customer } from "../entities/customer.entity";

export interface CustomerRepository {
  create(email: string): Promise<Customer>;
  delete(email: string): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
