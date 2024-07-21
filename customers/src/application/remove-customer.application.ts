import { Inject, Injectable } from "@nestjs/common";

import { RemoveCustomerApplication } from "./interfaces/remove-customer.application.interface";
import { CustomerService } from "../domain/services/interfaces/customer.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class RemoveCustomerApplicationImpl
  implements RemoveCustomerApplication
{
  constructor(
    @Inject(TYPES.services.CustomerService)
    private readonly customerService: CustomerService,
  ) {}

  async execute(email: string): Promise<void> {
    await this.customerService.remove(email);
  }
}
