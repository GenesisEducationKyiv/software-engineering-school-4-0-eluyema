import { Inject, Injectable } from "@nestjs/common";
import { SubscriptionStatus } from "@prisma/client";

import { SubscriptionService } from "./interfaces/subscription.service.interface";
import { MetricsService } from "../../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../../ioc/types";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionRepository } from "../repositories/subscription.repository";

@Injectable()
export class SubscriptionServiceImpl implements SubscriptionService {
  constructor(
    @Inject(TYPES.repositories.SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "subscription_created",
      "Count of subscriptions creation",
      ["status"],
    );

    this.metricsService.initCounter(
      "subscription_removal",
      "Count of subscriptions removal",
      ["status"],
    );
  }

  async create(email: string): Promise<boolean> {
    try {
      const existingSubscription =
        await this.subscriptionRepository.findByEmail(email);
      if (existingSubscription) {
        this.metricsService.incrementCounter("subscription_created", {
          status: "failed",
        });
        return false;
      }
      await this.subscriptionRepository.create(email);
      this.metricsService.incrementCounter("subscription_created", {
        status: "success",
      });
      return true;
    } catch (err) {
      this.metricsService.incrementCounter("subscription_created", {
        status: "failed",
      });
      throw err;
    }
  }

  async unsubscribe(email: string): Promise<void> {
    try {
      await this.subscriptionRepository.delete(email);
      this.metricsService.incrementCounter("subscription_removal", {
        status: "success",
      });
    } catch (err) {
      this.metricsService.incrementCounter("subscription_removal", {
        status: "failed",
      });
    }
  }

  async getSubscribers(): Promise<string[]> {
    const subscriptions: Subscription[] =
      await this.subscriptionRepository.findAll();

    const subscribers = subscriptions.map((subscription) => subscription.email);

    return subscribers;
  }

  async updateStatus(email: string, status: SubscriptionStatus): Promise<void> {
    await this.subscriptionRepository.updateStatus(email, status);
  }
}
