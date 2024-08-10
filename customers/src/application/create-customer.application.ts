import { Inject, Injectable, Logger } from "@nestjs/common";

import { CreateCustomerApplication } from "./interfaces/create-customer.application.interface";
import { CustomerService } from "../domain/services/interfaces/customer.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class CreateCustomerApplicationImpl
  implements CreateCustomerApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.CustomerService)
    private readonly customerService: CustomerService,
  ) {}

  async execute(email: string): Promise<boolean> {
    try {
      this.logger.log(`Creation customer ${email} started`);
      const result = await this.customerService.create(email);
      this.logger.log(`Creation customer ${email} finished`);
      return result;
    } catch (err) {
      this.logger.error(
        `Creation customer ${email} failed! Error: ${err.message}`,
      );
      throw err;
    }
  }
}
