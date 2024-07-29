import {
  Controller,
  Inject,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CreateCustomerDto } from "./dtos/create-customer.dto";
import { RemoveCustomerDto } from "./dtos/remove-customer.dto";
import { CreateCustomerApplication } from "../application/interfaces/create-customer.application.interface";
import { RemoveCustomerApplication } from "../application/interfaces/remove-customer.application.interface";
import { KafkaMetricsInterceptor } from "../infrastructure/metrics/kafka-metrics.interceptor";
import { Event } from "../infrastructure/notification/event";
import { TYPES } from "../ioc";

@UseInterceptors(KafkaMetricsInterceptor)
@Controller()
export class CustomerController {
  constructor(
    @Inject(TYPES.applications.CreateCustomerApplication)
    private readonly createCustomerApplication: CreateCustomerApplication,
    @Inject(TYPES.applications.RemoveCustomerApplication)
    private readonly removeCustomerApplication: RemoveCustomerApplication,
  ) {}

  @EventPattern("create-customer")
  async createCustomer(
    @Payload(ValidationPipe) value: Event<CreateCustomerDto>,
  ) {
    await this.createCustomerApplication.execute(value.data.email);
  }

  @EventPattern("remove-customer")
  async removeCustomer(
    @Payload(ValidationPipe) value: Event<RemoveCustomerDto>,
  ) {
    await this.removeCustomerApplication.execute(value.data.email);
  }
}
