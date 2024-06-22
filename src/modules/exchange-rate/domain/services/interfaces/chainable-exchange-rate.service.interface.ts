import { ExchangeRate } from '../../entities/exchange-rate.entity';

export interface ChainableExchangeRateService {
  setNext(chain: ChainableExchangeRateService): ChainableExchangeRateService;
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
