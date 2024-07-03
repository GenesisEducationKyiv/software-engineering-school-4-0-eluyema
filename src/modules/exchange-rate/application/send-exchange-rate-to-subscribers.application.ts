import { Inject, Injectable } from '@nestjs/common';

import { SubscriptionService } from 'src/modules/subscription/domain/services/interfaces/subscription.service.interface';
import { TYPES as SUBSCRIPTION_TYPES } from 'src/modules/subscription/ioc';

import { ExchangeRateNotificationService } from './interfaces/exchange-rate-notification.service.interface';
import { SendExchangeRateToSubscribersApplication } from './interfaces/send-exchange-rate-to-subscribers.application.interface';
import { ExchangeRateService } from '../domain/services/interfaces/exchange-rate.service.interface';
import { TYPES as EXCHANGE_RATE_TYPES } from '../ioc';

@Injectable()
export class SendExchangeRateToSubscribersApplicationImpl
  implements SendExchangeRateToSubscribersApplication
{
  constructor(
    @Inject(EXCHANGE_RATE_TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
    @Inject(SUBSCRIPTION_TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(EXCHANGE_RATE_TYPES.infrastructure.ExchangeRateNotificationService)
    private readonly exchangeRateNotificationService: ExchangeRateNotificationService,
  ) {}

  async execute(): Promise<void> {
    const [exchangeRate, subscribers] = await Promise.all([
      this.exchangeRateService.getCurrentExchangeRate(),
      this.subscriptionService.getSubscribers(),
    ]);

    if (!subscribers.length) {
      return;
    }

    await this.exchangeRateNotificationService.sendExchangeRateNotification(
      exchangeRate,
      subscribers,
    );
  }
}
