import { ExchangeRate } from '../../entities/exchange-rate.entity';

export interface ExchangeRateFactory {
  create(base: string, rate: number, date: Date): ExchangeRate;
}
