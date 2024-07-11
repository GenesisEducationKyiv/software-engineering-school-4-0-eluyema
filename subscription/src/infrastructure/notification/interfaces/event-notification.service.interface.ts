export interface EventNotificationService {
  emitEvent<T>(
    eventName: string,
    payload: T,
    aggregateId?: string,
  ): Promise<void>;
}
