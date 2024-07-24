import { randomUUID } from "crypto";

import { Event } from "./event";

export class EventFactory {
  static createEvent<T>(
    eventType: string,
    data: T,
    aggregateId?: string,
  ): Event<T> {
    return {
      eventId: randomUUID(),
      eventType,
      aggregateId: aggregateId ?? null,
      timestamp: new Date().toISOString(),
      data,
    };
  }
}
