export interface Event<T> {
  eventId: string;
  eventType: string;
  aggregateId: string | null;
  timestamp: string;
  data: T;
}
