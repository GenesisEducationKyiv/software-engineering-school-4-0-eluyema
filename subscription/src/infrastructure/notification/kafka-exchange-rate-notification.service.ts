import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { EventFactory } from "./event.factory";
import { NotificationService } from "./interfaces/notification.service.interface";

@Injectable()
export class KafkaExchangeRateNotificationService
  implements NotificationService
{
  constructor(
    @Inject("exchange-rate-microservice")
    protected readonly serverClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.serverClient.connect();
  }

  async sendNotify(subscribers: string[]): Promise<void> {
    if (!subscribers.length) return;

    await this.serverClient.emit(
      "exchange-rate-notification-requested",
      JSON.stringify(
        EventFactory.createEvent("exchange-rate-notification-requested", {
          emails: subscribers,
        }),
      ),
    );
  }
}
