import { Inject, Injectable } from "@nestjs/common";

import { EventNotificationService } from "src/infrastructure/notification/interfaces/event-notification.service.interface";

import { CreateSubscriptionSagaOrchestratorApplication } from "./interfaces/create-subscription-saga-orchestrator.application.interface";
import { SubscriptionService } from "../domain/services/interfaces/subscription.service.interface";
import { MetricsService } from "../infrastructure/metrics/interfaces/metrics.service.interface";
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
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "subscription_creation_ended_transactions",
      "Counter of ended subscription creation transactions",
      ["status"],
    );
  }

  async execute(email: string): Promise<boolean> {
    try {
      const result = await this.subscriptionService.create(email);
      if (result) {
        await this.eventNotificationService.emitEvent("create-customer", {
          email,
        });
      }
      return result;
    } catch (err) {
      this.metricsService.incrementCounter(
        "subscription_creation_ended_transactions",
        {
          status: "failed",
        },
      );
      throw err;
    }
  }

  async onCustomerCreateFail(email: string): Promise<void> {
    try {
      await this.subscriptionService.unsubscribe(email);
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

  async onCustomerCreateSuccess(email: string): Promise<void> {
    try {
      await this.subscriptionService.updateStatus(email, "ACTIVE");
      this.metricsService.incrementCounter(
        "subscription_creation_ended_transactions",
        {
          status: "success",
        },
      );
    } catch (err) {
      this.metricsService.incrementCounter(
        "subscription_creation_ended_transactions",
        {
          status: "failed",
        },
      );
      throw err;
    }
  }
}
