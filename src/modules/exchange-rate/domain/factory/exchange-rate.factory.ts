import { Injectable } from '@nestjs/common';

import { ExchangeRateFactory } from './interfaces/exchange-rate.factory.interface';
import { ExchangeRate } from '../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateFactoryImpl implements ExchangeRateFactory {
  create(base: string, rate: number, date: Date): ExchangeRate {
    return new ExchangeRate(base, rate, date);
  }
}
