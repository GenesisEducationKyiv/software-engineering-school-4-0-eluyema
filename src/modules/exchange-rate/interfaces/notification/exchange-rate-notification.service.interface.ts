import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

export interface ExchangeRateNotificationService {
  sendExchangeRateNotification(exchangeRate: ExchangeRate): Promise<void>;
}
