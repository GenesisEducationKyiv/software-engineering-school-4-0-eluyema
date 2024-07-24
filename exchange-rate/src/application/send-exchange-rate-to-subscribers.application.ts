import { Inject, Injectable } from "@nestjs/common";

import { ExchangeRateNotificationService } from "./interfaces/exchange-rate-notification.service.interface";
import { SendExchangeRateToSubscribersApplication } from "./interfaces/send-exchange-rate-to-subscribers.application.interface";
import { ExchangeRateService } from "../domain/services/interfaces/exchange-rate.service.interface";
import { TYPES } from "../ioc";

@Injectable()
export class SendExchangeRateToSubscribersApplicationImpl
  implements SendExchangeRateToSubscribersApplication
{
  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
    @Inject(TYPES.infrastructure.ExchangeRateNotificationService)
    private readonly exchangeRateNotificationService: ExchangeRateNotificationService,
  ) {}

  async execute(subscriberEmails: string[]): Promise<void> {
    const exchangeRate =
      await this.exchangeRateService.getCurrentExchangeRate();

    if (!subscriberEmails.length) {
      return;
    }

    await this.exchangeRateNotificationService.sendExchangeRateNotification(
      exchangeRate,
      subscriberEmails,
    );
  }
}
