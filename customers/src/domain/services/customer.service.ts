import { Inject, Injectable } from "@nestjs/common";

import { CustomerService } from "./interfaces/customer.service.interface";
import { MetricsService } from "../../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../../ioc/types";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";

@Injectable()
export class CustomerServiceImpl implements CustomerService {
  constructor(
    @Inject(TYPES.repositories.CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "customers_created",
      "Count of customers creation",
      ["status"],
    );

    this.metricsService.initCounter(
      "customers_removal",
      "Count of customers removal",
      ["status"],
    );
  }

  async create(email: string): Promise<boolean> {
    try {
      const existingSubscription =
        await this.customerRepository.findByEmail(email);
      if (existingSubscription) {
        this.metricsService.incrementCounter("customers_created", {
          status: "failed",
        });
        return false;
      }
      await this.customerRepository.create(email);
      this.metricsService.incrementCounter("customers_created", {
        status: "success",
      });

      return true;
    } catch (err) {
      this.metricsService.incrementCounter("customers_created", {
        status: "failed",
      });
      throw err;
    }
  }

  async remove(email: string): Promise<void> {
    try {
      await this.customerRepository.delete(email);
      this.metricsService.incrementCounter("customers_removal", {
        status: "success",
      });
    } catch (err) {
      this.metricsService.incrementCounter("customers_removal", {
        status: "failed",
      });
      throw err;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    const customers: Customer[] = await this.customerRepository.findAll();

    return customers;
  }
}
