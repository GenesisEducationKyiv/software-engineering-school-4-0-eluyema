import { Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { EventFactory } from "./event.factory";
import { EventNotificationService } from "./interfaces/event-notification.service.interface";

export class KafkaEventNotificationServiceImpl
  implements EventNotificationService
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly serverClient: ClientKafka) {}

  async onModuleInit() {
    try {
      this.logger.debug("Kafka start connect");
      await this.serverClient.connect();
      this.logger.debug("Kafka connected");
    } catch (err) {
      this.logger.error("Kafka connection failed! " + err.message);
      throw err;
    }
  }

  async emitEvent(eventName: string, payload: unknown, aggregateId?: string) {
    const eventBody = JSON.stringify(
      EventFactory.createEvent(eventName, payload, aggregateId),
    );
    try {
      this.logger.debug(`Kafka emit event (${eventName}) "${eventBody}"`);
      await this.serverClient.emit(eventName, eventBody);
    } catch (err) {
      this.logger.error(
        `Kafka emit event(${eventName}) "${eventBody}" failed. Error: ` +
          err.message,
      );
      throw err;
    }
  }
}
