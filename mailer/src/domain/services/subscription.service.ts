import { Inject, Injectable, Logger } from "@nestjs/common";

import { SubscriptionService } from "./interfaces/subscription.service.interface";
import { MetricsService } from "../../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../../ioc/types";
import { Subscription } from "../entities/subscription.entity";
import { SubscriptionRepository } from "../repositories/subscription.repository";

@Injectable()
export class SubscriptionServiceImpl implements SubscriptionService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.repositories.SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "mailer_subscription_creation",
      "Count of mailer subscription creation",
      ["status"],
    );
    this.metricsService.initCounter(
      "mailer_subscription_removal",
      "Count of mailer subscription removal",
      ["status"],
    );
  }

  async create(email: string): Promise<boolean> {
    try {
      this.logger.log(`Try to find subscription ${email}`);
      const existingSubscription =
        await this.subscriptionRepository.findByEmail(email);
      if (existingSubscription) {
        this.logger.log(`Subscription ${email} already exists`);
        this.metricsService.incrementCounter("mailer_subscription_creation", {
          status: "failed",
        });
        return false;
      }
      this.logger.log(`Subscription ${email} creation started`);
      await this.subscriptionRepository.create(email);
      this.logger.log(`Subscription ${email} creation success`);
      this.metricsService.incrementCounter("mailer_subscription_creation", {
        status: "success",
      });
      return true;
    } catch (err) {
      this.logger.log(
        `Subscription ${email} creation failed! Error: ` + err.message,
      );
      this.metricsService.incrementCounter("mailer_subscription_creation", {
        status: "failed",
      });
      throw err;
    }
  }

  async delete(email: string): Promise<void> {
    try {
      this.logger.log(`Subscription ${email} removal started`);
      await this.subscriptionRepository.delete(email);
      this.logger.log(`Subscription ${email} removal success`);
      this.metricsService.incrementCounter("mailer_subscription_removal", {
        status: "success",
      });
    } catch (err) {
      this.logger.error(
        `Subscription ${email} removal failed! Error: ` + err.message,
      );
      this.metricsService.incrementCounter("mailer_subscription_removal", {
        status: "failed",
      });
      throw err;
    }
  }

  async getSubscribers(): Promise<string[]> {
    try {
      this.logger.log(`Find subscriptions started`);
      const subscriptions: Subscription[] =
        await this.subscriptionRepository.findAll();

      this.logger.log(`Find subscriptions success`);

      const subscribers = subscriptions.map(
        (subscription) => subscription.email,
      );

      return subscribers;
    } catch (err) {
      this.logger.error(`Find subscriptions failed! Error: ` + err.message);
      throw err;
    }
  }
}
