import { Inject, Injectable } from "@nestjs/common";

import { EventNotificationService } from "src/infrastructure/notification/interfaces/event-notification.service.interface";

import { RemoveSubscriptionSagaOrchestratorApplication } from "./interfaces/remove-subscription-saga-orchestrator.application.interface";
import { SubscriptionService } from "../domain/services/interfaces/subscription.service.interface";
import { MetricsService } from "../infrastructure/metrics/interfaces/metrics.service.interface";
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
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "subscription_removal_ended_transactions",
      "Counter of ended subscription removal transactions",
      ["status"],
    );
  }

  async execute(email: string): Promise<void> {
    try {
      await this.subscriptionService.updateStatus(email, "PENDING");
      await this.eventNotificationService.emitEvent("remove-customer", {
        email,
      });
    } catch (err) {
      this.metricsService.incrementCounter(
        "subscription_removal_ended_transactions",
        {
          status: "failed",
        },
      );
      throw err;
    }
  }

  async onCustomerRemoveFail(email: string): Promise<void> {
    try {
      await this.subscriptionService.updateStatus(email, "ACTIVE");
    } catch (err) {
      throw err;
    } finally {
      this.metricsService.incrementCounter(
        "subscription_removal_ended_transactions",
        {
          status: "failed",
        },
      );
    }
  }

  async onCustomerRemoveSuccess(email: string): Promise<void> {
    try {
      await this.subscriptionService.unsubscribe(email);
      this.metricsService.incrementCounter(
        "subscription_removal_ended_transactions",
        {
          status: "success",
        },
      );
    } catch (err) {
      this.metricsService.incrementCounter(
        "subscription_removal_ended_transactions",
        {
          status: "failed",
        },
      );
      throw err;
    }
  }
}
