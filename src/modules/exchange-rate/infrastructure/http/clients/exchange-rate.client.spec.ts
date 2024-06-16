import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { TestAppConfigServiceImpl } from 'src/test-utils/config/test-app-config.service';

import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';
import { ExchangeRateClientImpl } from './exchange-rate.client';

jest.mock('@nestjs/axios', () => ({
  HttpService: function () {
    this.get = jest.fn();
  },
}));

describe('ExchangeRateClientImpl', () => {
  let client: ExchangeRateClientImpl;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = new HttpService();
    client = new ExchangeRateClientImpl(
      httpService,
      new TestAppConfigServiceImpl(),
    );
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

  it('should throw an error when request failed', () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new AxiosError('Request failed', '500');
    });

    client
      .fetchExchangeRates()
      .then((data) => {
        expect(data).toBeUndefined();
      })
      .catch((err) => {
        expect(err.message).toEqual('Request to get currency rate failed');
      });
  });
});
