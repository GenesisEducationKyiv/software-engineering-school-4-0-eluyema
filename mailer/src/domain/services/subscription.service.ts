import { Inject, Injectable } from "@nestjs/common";

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
      "subscription_creation",
      "Count of subscription creation",
      ["status"],
    );
    this.metricsService.initCounter(
      "subscription_removal",
      "Count of subscription removal",
      ["status"],
    );
  }

  async create(email: string): Promise<boolean> {
    try {
      const existingSubscription =
        await this.subscriptionRepository.findByEmail(email);
      if (existingSubscription) {
        this.metricsService.incrementCounter("subscription_creation", {
          status: "failed",
        });
        return false;
      }
      await this.subscriptionRepository.create(email);
      this.metricsService.incrementCounter("subscription_creation", {
        status: "success",
      });
      return true;
    } catch (err) {
      this.metricsService.incrementCounter("subscription_creation", {
        status: "failed",
      });
      throw err;
    }
  }

  async delete(email: string): Promise<void> {
    try {
      await this.subscriptionRepository.delete(email);
      this.metricsService.incrementCounter("subscription_removal", {
        status: "success",
      });
    } catch (err) {
      this.metricsService.incrementCounter("subscription_removal", {
        status: "failed",
      });
      throw err;
    }
  }

  async getSubscribers(): Promise<string[]> {
    const subscriptions: Subscription[] =
      await this.subscriptionRepository.findAll();

    const subscribers = subscriptions.map((subscription) => subscription.email);

    return subscribers;
  }
}
