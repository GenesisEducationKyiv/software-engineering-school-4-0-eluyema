import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';
import { ExchangeRateClientImpl } from './exchange-rate.client';

describe('ExchangeRateClientImpl', () => {
  let client: ExchangeRateClientImpl;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateClientImpl,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                'exchangeApi.url': 'https://api.exchangerate.com',
                'exchangeApi.key': 'test-api-key',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    client = module.get<ExchangeRateClientImpl>(ExchangeRateClientImpl);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  it('should fetch exchange rates', async () => {
    const result: GetExchangeRatesDto = {
      disclaimer: '',
      license: '',
      timestamp: '1627840847',
      base: 'USD',
      rates: { UAH: 28 },
    };
    const axiosResponse: AxiosResponse<GetExchangeRatesDto> = {
      data: result,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders },
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
    const data = await client.fetchExchangeRates();
    expect(data).toEqual(result);
  });
});
