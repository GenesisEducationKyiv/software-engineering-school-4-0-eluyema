export interface EventNotificationService {
  emitEvent(
    eventName: string,
    payload: unknown,
    aggregateId?: string,
  ): Promise<void>;
}
