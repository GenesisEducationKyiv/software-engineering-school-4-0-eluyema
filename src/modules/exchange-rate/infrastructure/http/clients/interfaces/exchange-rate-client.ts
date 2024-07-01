import { ExchangeRate } from 'src/modules/exchange-rate/domain/entities/exchange-rate.entity';

export interface ExchangeRateClient {
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
