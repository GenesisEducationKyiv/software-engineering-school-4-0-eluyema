import { Inject, Injectable, Logger } from "@nestjs/common";

import { RateService } from "src/domain/services/interfaces/rate.service.interface";
import { SubscriptionService } from "src/domain/services/interfaces/subscription.service.interface";

import { ExchangeRateNotificationService } from "./interfaces/exchange-rate-notification.service.interface";
import { NotifyRateSubscribersApplication } from "./interfaces/notify-rate-subscribers.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class NotifyRateSubscribersApplicationImpl
  implements NotifyRateSubscribersApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.RateService)
    private readonly rateService: RateService,
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(TYPES.services.ExchangeRateNotificationService)
    private readonly exchangeRateNotificationService: ExchangeRateNotificationService,
  ) {}

  async execute(): Promise<void> {
    try {
      this.logger.log("Start loading exchange rate and subscriptions list");
      const [rate, subscriptions] = await Promise.all([
        this.rateService.getRate(),
        this.subscriptionService.getSubscribers(),
      ]);
      this.logger.log(
        `Loaded exchange rate (${rate.rate}) and subscription list (${subscriptions.length} amount)`,
      );

      if (!subscriptions.length) {
        this.logger.log(
          `Subscription list is empty; exchange rate will not be sent.`,
        );

        return;
      }

      await this.exchangeRateNotificationService.sendExchangeRateNotification(
        rate,
        subscriptions,
      );
      this.logger.log(`Subscription notification email sent`);
    } catch (err) {
      this.logger.error(`Exchange rate notification failed`);
      throw err;
    }
  }
}
