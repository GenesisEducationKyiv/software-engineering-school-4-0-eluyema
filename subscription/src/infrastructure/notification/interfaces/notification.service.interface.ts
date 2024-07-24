export interface NotificationService {
  sendNotify(subscribers: string[]): Promise<void>;
}
