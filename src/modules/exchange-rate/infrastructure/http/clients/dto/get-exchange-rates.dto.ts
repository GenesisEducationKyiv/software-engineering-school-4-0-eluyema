export class GetExchangeRatesDto {
  disclaimer: string;
  license: string;
  timestamp: string;
  base: string;
  rates: Record<string, number>;
}
