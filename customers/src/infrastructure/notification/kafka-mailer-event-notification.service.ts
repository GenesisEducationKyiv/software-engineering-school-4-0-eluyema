import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { TYPES } from "src/ioc";

import { EventFactory } from "./event.factory";
import { EventNotificationService } from "./interfaces/event-notification.service.interface";

@Injectable()
export class KafkaMailerEventNotificationServiceImpl
  implements EventNotificationService
{
  constructor(
    @Inject(TYPES.brokers.Subscription)
    protected readonly serverClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.serverClient.connect();
  }

  async emitEvent<T>(eventName: string, payload: T, aggregateId?: string) {
    await this.serverClient.emit(
      eventName,
      JSON.stringify(EventFactory.createEvent(eventName, payload, aggregateId)),
    );
  }
}
