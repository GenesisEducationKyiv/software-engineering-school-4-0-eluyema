import { Rate } from "src/domain/entities/rate.entity";

export interface ExchangeRateNotificationService {
  sendExchangeRateNotification(
    exchangeRate: Rate,
    recipients: string[],
  ): Promise<void>;
}
