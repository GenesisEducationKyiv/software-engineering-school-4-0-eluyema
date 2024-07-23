import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { AddRateSubscriptionApplication } from "src/application/interfaces/add-rate-subscription.application.interface";
import { RemoveRateSubscriptionApplication } from "src/application/interfaces/remove-rate-subscription.application.interface";
import { Event } from "src/infrastructure/notification/event";
import { TYPES } from "src/ioc";

import { SubscriptionCreatedDto } from "./dtos/subscription-created.dto";

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(TYPES.applications.AddRateSubscriptionApplication)
    private readonly addRateSubscriptionApplication: AddRateSubscriptionApplication,
    @Inject(TYPES.applications.RemoveRateSubscriptionApplication)
    private readonly removeRateSubscriptionApplication: RemoveRateSubscriptionApplication,
  ) {}

  @EventPattern("subscription-created")
  async subscriptionCreated(
    @Payload(ValidationPipe) value: Event<SubscriptionCreatedDto>,
  ) {
    await this.addRateSubscriptionApplication.execute(value.data);
  }

  @EventPattern("subscription-removed")
  async subscriptionRemoved(
    @Payload(ValidationPipe) value: Event<SubscriptionCreatedDto>,
  ) {
    await this.removeRateSubscriptionApplication.execute(value.data);
  }
}
