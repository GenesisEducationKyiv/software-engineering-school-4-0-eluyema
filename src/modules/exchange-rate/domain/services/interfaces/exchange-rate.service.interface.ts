import { ExchangeRate } from '../../entities/exchange-rate.entity';

export interface ExchangeRateService {
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
