import { Inject, Injectable } from "@nestjs/common";

import { RateService } from "src/domain/services/interfaces/rate.service.interface";
import { SubscriptionService } from "src/domain/services/interfaces/subscription.service.interface";

import { ExchangeRateNotificationService } from "./interfaces/exchange-rate-notification.service.interface";
import { NotifyRateSubscribersApplication } from "./interfaces/notify-rate-subscribers.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class NotifyRateSubscribersApplicationImpl
  implements NotifyRateSubscribersApplication
{
  constructor(
    @Inject(TYPES.services.RateService)
    private readonly rateService: RateService,
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(TYPES.services.ExchangeRateNotificationService)
    private readonly exchangeRateNotificationService: ExchangeRateNotificationService,
  ) {}

  async execute(): Promise<void> {
    const [rate, subscriptions] = await Promise.all([
      this.rateService.getRate(),
      this.subscriptionService.getSubscribers(),
    ]);

    if (!subscriptions.length) {
      return;
    }

    await this.exchangeRateNotificationService.sendExchangeRateNotification(
      rate,
      subscriptions,
    );
  }
}