import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

export interface FetchExchangeRateApplication {
  execute(): Promise<ExchangeRate>;
}
