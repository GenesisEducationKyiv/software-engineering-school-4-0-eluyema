import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CreateSubscriptionSagaOrchestratorApplication } from "src/application/interfaces/create-subscription-saga-orchestrator.application.interface";
import { RemoveSubscriptionSagaOrchestratorApplication } from "src/application/interfaces/remove-subscription-saga-orchestrator.application.interface";

import { CustomerCreateFailedDto } from "./dto/customer-create-failed.dto";
import { CustomerCreatedDto } from "./dto/customer-created.dto";
import { CustomerRemoveFailedDto } from "./dto/customer-remove-failed.dto";
import { CustomerRemovedDto } from "./dto/customer-removed.dto";
import { Event } from "../infrastructure/notification/event";
import { TYPES } from "../ioc";

@Controller()
export class KafkaSubscriptionController {
  constructor(
    @Inject(TYPES.applications.CreateSubscriptionSagaOrchestratorApplication)
    private readonly createSubscriptionSagaOrchestratorApplication: CreateSubscriptionSagaOrchestratorApplication,
    @Inject(TYPES.applications.RemoveSubscriptionSagaOrchestratorApplication)
    private readonly removeSubscriptionSagaOrchestratorApplication: RemoveSubscriptionSagaOrchestratorApplication,
  ) {}

  @EventPattern("customer-created")
  async onCustomerCreated(
    @Payload(ValidationPipe) value: Event<CustomerCreatedDto>,
  ) {
    await this.createSubscriptionSagaOrchestratorApplication.execute(
      value.data.email,
    );
  }

  @EventPattern("customer-create-failed")
  async onCustomerCreateFailed(
    @Payload(ValidationPipe) value: Event<CustomerCreateFailedDto>,
  ) {
    await this.createSubscriptionSagaOrchestratorApplication.execute(
      value.data.email,
    );
  }

  @EventPattern("customer-removed")
  async onCustomerRemoved(
    @Payload(ValidationPipe) value: Event<CustomerRemovedDto>,
  ) {
    await this.removeSubscriptionSagaOrchestratorApplication.execute(
      value.data.email,
    );
  }

  @EventPattern("customer-remove-failed")
  async onCustomerRemoveFailed(
    @Payload(ValidationPipe) value: Event<CustomerRemoveFailedDto>,
  ) {
    await this.removeSubscriptionSagaOrchestratorApplication.execute(
      value.data.email,
    );
  }
}