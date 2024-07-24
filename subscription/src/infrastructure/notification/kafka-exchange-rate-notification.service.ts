import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { TYPES } from "src/ioc";

import { EventFactory } from "./event.factory";
import { NotificationService } from "./interfaces/notification.service.interface";

@Injectable()
export class KafkaExchangeRateNotificationService
  implements NotificationService
{
  constructor(
    @Inject(TYPES.brokers.ExchangeRate)
    protected readonly exchangeRateClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.exchangeRateClient.connect();
  }

  async sendNotify(subscribers: string[]): Promise<void> {
    if (!subscribers.length) return;

    await this.exchangeRateClient.emit(
      "exchange-rate-notification-requested",
      JSON.stringify(
        EventFactory.createEvent("exchange-rate-notification-requested", {
          emails: subscribers,
        }),
      ),
    );
  }
}
