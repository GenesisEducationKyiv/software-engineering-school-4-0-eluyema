import { Test, TestingModule } from '@nestjs/testing';

import { ExchangeRateServiceImpl } from './exchange-rate.service';
import { GetExchangeRatesDto } from '../../infrastructure/http/clients/dto/get-exchange-rates.dto';
import { ExchangeRateClient } from '../../infrastructure/http/clients/interfaces/exchange-rate.client';
import { TYPES } from '../../infrastructure/ioc/types';

describe('ExchangeRateServiceImpl', () => {
  let service: ExchangeRateServiceImpl;
  let exchangeRateClient: ExchangeRateClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateServiceImpl,
        {
          provide: TYPES.infrastructure.ExchangeRateClient,
          useValue: {
            fetchExchangeRates: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeRateServiceImpl>(ExchangeRateServiceImpl);
    exchangeRateClient = module.get<ExchangeRateClient>(
      TYPES.infrastructure.ExchangeRateClient,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get exchange rate', async () => {
    const exchangeRatesDto: GetExchangeRatesDto = {
      disclaimer: '',
      license: '',
      timestamp: '1627840847',
      base: 'USD',
      rates: { UAH: 28 },
    };
    jest
      .spyOn(exchangeRateClient, 'fetchExchangeRates')
      .mockImplementation(async () => exchangeRatesDto);

    const currentTime = new Date();
    const exchangeRate = await service.getCurrentExchangeRate();

    expect(exchangeRate.base).toEqual('USD');
    expect(exchangeRate.date.getTime()).toBeGreaterThanOrEqual(
      currentTime.getTime(),
    );
    expect(exchangeRate.rate).toBeGreaterThan(0);
  });
});
