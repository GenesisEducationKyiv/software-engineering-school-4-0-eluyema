import { Inject, Injectable } from "@nestjs/common";

import { CustomerService } from "./interfaces/customer.service.interface";
import { TYPES } from "../../ioc/types";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";

@Injectable()
export class CustomerServiceImpl implements CustomerService {
  constructor(
    @Inject(TYPES.repositories.CustomerRepository)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(email: string): Promise<boolean> {
    const existingSubscription =
      await this.customerRepository.findByEmail(email);
    if (existingSubscription) {
      return false;
    }
    await this.customerRepository.create(email);
    return true;
  }

  async remove(email: string): Promise<void> {
    await this.customerRepository.delete(email);
  }

  async getCustomers(): Promise<Customer[]> {
    const customers: Customer[] = await this.customerRepository.findAll();

    return customers;
  }
}
