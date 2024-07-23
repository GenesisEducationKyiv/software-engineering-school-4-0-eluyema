import { Inject, Injectable } from "@nestjs/common";

import { EventNotificationService } from "src/infrastructure/notification/interfaces/event-notification.service.interface";

import { RemoveSubscriptionSagaOrchestratorApplication } from "./interfaces/remove-subscription-saga-orchestrator.application.interface";
import { SubscriptionService } from "../domain/services/interfaces/subscription.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class RemoveSubscriptionSagaOrchestratorApplicationImpl
  implements RemoveSubscriptionSagaOrchestratorApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(TYPES.infrastructure.EventCustomersNotificationService)
    private readonly eventNotificationService: EventNotificationService,
  ) {}

  async execute(email: string): Promise<void> {
    await this.subscriptionService.updateStatus(email, "PENDING");
    await this.eventNotificationService.emitEvent("remove-customer", { email });
  }

  async onCustomerRemoveFail(email: string): Promise<void> {
    await this.subscriptionService.updateStatus(email, "ACTIVE");
  }

  async onCustomerRemoveSuccess(email: string): Promise<void> {
    return this.subscriptionService.unsubscribe(email);
  }
}
