import { Inject, Injectable } from "@nestjs/common";

import { EventNotificationService } from "src/infrastructure/notification/interfaces/event-notification.service.interface";

import { RateUpdatedDto } from "./dtos/rate-updated.dto";
import { NotifyCurrentExchangeRateApplication } from "./interfaces/notify-current-exchange-rate.application.interface";
import { ExchangeRateService } from "../domain/services/interfaces/exchange-rate.service.interface";
import { MetricsService } from "../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../ioc";

@Injectable()
export class NotifyCurrentExchangeRateApplicationImpl
  implements NotifyCurrentExchangeRateApplication
{
  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
    @Inject(TYPES.infrastructure.EventNotificationService)
    private readonly eventNotificationService: EventNotificationService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "rate_update_notification",
      "Rate update cron calls counter",
    );
  }

  async execute(): Promise<void> {
    const exchangeRate =
      await this.exchangeRateService.getCurrentExchangeRate();

    const eventPayload: RateUpdatedDto = {
      rate: exchangeRate.rate,
      name: "UAH",
      timestamp: Date.now(),
    };
    await this.eventNotificationService.emitEvent("rate-updated", eventPayload);
    this.metricsService.incrementCounter("rate_update_notification");
  }
}
