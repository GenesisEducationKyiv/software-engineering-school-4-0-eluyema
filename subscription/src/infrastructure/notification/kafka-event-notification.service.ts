import { ClientKafka } from "@nestjs/microservices";

import { EventFactory } from "./event.factory";
import { EventNotificationService } from "./interfaces/event-notification.service.interface";

export class KafkaEventNotificationServiceImpl
  implements EventNotificationService
{
  constructor(protected readonly serverClient: ClientKafka) {}

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