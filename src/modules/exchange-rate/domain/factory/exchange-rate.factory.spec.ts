import { Test, TestingModule } from '@nestjs/testing';

import { ExchangeRateFactoryImpl } from './exchange-rate.factory';
import { ExchangeRateFactory } from './interfaces/exchange-rate.factory.interface';
import { ExchangeRate } from '../entities/exchange-rate.entity';

describe('ExchangeRateService', () => {
  let service: ExchangeRateFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateFactoryImpl],
    }).compile();

    service = module.get<ExchangeRateFactory>(ExchangeRateFactoryImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an exchange rate entity', () => {
    const base = 'USD';
    const rate = 28;
    const date = new Date();
    const exchangeRate = service.create(base, rate, date);
    expect(exchangeRate).toBeInstanceOf(ExchangeRate);
    expect(exchangeRate.base).toBe(base);
    expect(exchangeRate.rate).toBe(rate);
    expect(exchangeRate.date).toBe(date);
  });
});
