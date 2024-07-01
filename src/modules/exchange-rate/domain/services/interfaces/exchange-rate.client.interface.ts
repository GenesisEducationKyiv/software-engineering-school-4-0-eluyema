import { ExchangeRate } from '../../entities/exchange-rate.entity';

export interface ExchangeRateClient {
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
