import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";

export interface ExchangeRateClient {
  getCurrentExchangeRate(): Promise<ExchangeRate>;
}
