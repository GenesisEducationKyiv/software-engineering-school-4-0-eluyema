import { Inject, Injectable } from "@nestjs/common";

import { CreateCustomerApplication } from "./interfaces/create-customer.application.interface";
import { CustomerService } from "../domain/services/interfaces/customer.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class CreateCustomerApplicationImpl
  implements CreateCustomerApplication
{
  constructor(
    @Inject(TYPES.services.CustomerService)
    private readonly customerService: CustomerService,
  ) {}

  async execute(email: string): Promise<boolean> {
    return this.customerService.create(email);
  }
}
