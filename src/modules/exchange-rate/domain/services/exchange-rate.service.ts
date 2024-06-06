import { Injectable } from '@nestjs/common';
import { ExchangeRate } from '../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService {
  constructor() {}

  createExchangeRate(base: string, rate: number, date: Date): ExchangeRate {
    return new ExchangeRate(base, rate, date);
  }
}
