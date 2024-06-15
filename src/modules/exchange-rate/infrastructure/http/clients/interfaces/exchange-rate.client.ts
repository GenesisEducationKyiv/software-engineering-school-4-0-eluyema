import { GetExchangeRatesDto } from '../dto/get-exchange-rates.dto';

export interface ExchangeRateClient {
  fetchExchangeRates(): Promise<GetExchangeRatesDto>;
}
