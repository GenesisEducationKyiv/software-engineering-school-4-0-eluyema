import { Inject, Injectable, Logger } from "@nestjs/common";

import { RemoveCustomerApplication } from "./interfaces/remove-customer.application.interface";
import { CustomerService } from "../domain/services/interfaces/customer.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class RemoveCustomerApplicationImpl
  implements RemoveCustomerApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.CustomerService)
    private readonly customerService: CustomerService,
  ) {}

  async execute(email: string): Promise<void> {
    try {
      this.logger.log(`Removing customer ${email} started`);
      await this.customerService.remove(email);
      this.logger.log(`Removing customer ${email} success`);
    } catch (err) {
      this.logger.log(
        `Removing customer ${email} failed! Error: ${err.message}`,
      );
      throw err;
    }
  }
}
