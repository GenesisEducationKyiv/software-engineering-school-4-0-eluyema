import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../entities/exchange-rate.entity';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateService],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an exchange rate entity', () => {
    const base = 'USD';
    const rate = 28;
    const date = new Date();
    const exchangeRate = service.createExchangeRate(base, rate, date);
    expect(exchangeRate).toBeInstanceOf(ExchangeRate);
    expect(exchangeRate.base).toBe(base);
    expect(exchangeRate.rate).toBe(rate);
    expect(exchangeRate.date).toBe(date);
  });
});
