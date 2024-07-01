import { ExchangeRate } from '../../entities/exchange-rate.entity';

export interface ChainExchangeRateService {
  setNext(chain: ChainExchangeRateService): ChainExchangeRateService;
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
