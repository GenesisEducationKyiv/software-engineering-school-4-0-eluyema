import { Inject, Injectable, Logger } from "@nestjs/common";

import { CustomerService } from "./interfaces/customer.service.interface";
import { MetricsService } from "../../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../../ioc/types";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";

@Injectable()
export class CustomerServiceImpl implements CustomerService {
  private readonly logger = new Logger(this.constructor.name);

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
      this.logger.log(`Creation customer ${email} started`);
      const existingCustomer = await this.customerRepository.findByEmail(email);

      if (existingCustomer) {
        this.logger.log(`Customer ${email} already exists`);
        this.metricsService.incrementCounter("customers_created", {
          status: "failed",
        });
        return false;
      }
      await this.customerRepository.create(email);
      this.logger.log(`Creation customer ${email} success`);
      this.metricsService.incrementCounter("customers_created", {
        status: "success",
      });

      return true;
    } catch (err) {
      this.logger.error(
        `Creation customer ${email} failed! Error: ${err.message}`,
      );
      this.metricsService.incrementCounter("customers_created", {
        status: "failed",
      });
      throw err;
    }
  }

  async remove(email: string): Promise<void> {
    try {
      this.logger.log(`Removal customer ${email} started`);
      await this.customerRepository.delete(email);
      this.metricsService.incrementCounter("customers_removal", {
        status: "success",
      });
      this.logger.log(`Removal customer ${email} success`);
    } catch (err) {
      this.logger.warn(
        `Removal customer ${email} failed! Error: ${err.message}`,
      );
      this.metricsService.incrementCounter("customers_removal", {
        status: "failed",
      });
      throw err;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      this.logger.log(`Find customer started`);
      const customers: Customer[] = await this.customerRepository.findAll();
      this.logger.log(
        `Find customer success (Found ${customers.length} customers)`,
      );
      return customers;
    } catch (err) {
      this.logger.log(`Find customer failed! Error: ${err.message}`);
      throw err;
    }
  }
}
