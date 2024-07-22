import { Inject, Injectable } from "@nestjs/common";

import { EventNotificationService } from "src/infrastructure/notification/interfaces/event-notification.service.interface";

import { CreateSubscriptionSagaOrchestratorApplication } from "./interfaces/create-subscription-saga-orchestrator.application.interface";
import { SubscriptionService } from "../domain/services/interfaces/subscription.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class CreateSubscriptionSagaOrchestratorApplicationImpl
  implements CreateSubscriptionSagaOrchestratorApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(TYPES.infrastructure.EventCustomersNotificationService)
    private readonly eventNotificationService: EventNotificationService,
  ) {}

  async execute(email: string): Promise<boolean> {
    const result = await this.subscriptionService.create(email);
    if (result) {
      await this.eventNotificationService.emitEvent("create-customer", {
        email,
      });
    }
    return result;
  }

  async onCustomerCreateFail(email: string): Promise<void> {
    await this.subscriptionService.unsubscribe(email);
  }

  async onCustomerCreateSuccess(email: string): Promise<void> {
    return this.subscriptionService.updateStatus(email, "ACTIVE");
  }
}
