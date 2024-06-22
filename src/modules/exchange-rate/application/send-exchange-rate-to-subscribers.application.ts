import { Inject, Injectable } from '@nestjs/common';

import { SubscriptionService } from 'src/modules/subscription/domain/services/interfaces/subscription.service.interface';
import { TYPES as SUBSCRIPTION_TYPES } from 'src/modules/subscription/infrastructure/ioc';

import { SendExchangeRateToSubscribersApplication } from './interfaces/send-exchange-rate-to-subscribers.application.interface';
import { BaseExchangeRateService } from '../domain/services/exchange-rate.service';
import { TYPES as EXCHANGE_RATE_TYPES } from '../infrastructure/ioc';
import { ExchangeRateNotificationService } from '../infrastructure/notification/interfaces/exchange-rate-notification.service.interface';

@Injectable()
export class SendExchangeRateToSubscribersApplicationImpl
  implements SendExchangeRateToSubscribersApplication
{
  constructor(
    @Inject(EXCHANGE_RATE_TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: BaseExchangeRateService,
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
