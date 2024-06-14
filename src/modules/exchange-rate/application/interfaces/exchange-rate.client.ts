import { GetExchangeRatesDto } from '../../infrastructure/http/clients/dto/get-exchange-rates.dto';

export interface ExchangeRateClient {
  fetchExchangeRates(): Promise<GetExchangeRatesDto>;
}
