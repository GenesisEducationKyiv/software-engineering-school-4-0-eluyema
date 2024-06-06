import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';
import { ExchangeRateClient } from 'src/modules/exchange-rate/interfaces/clients/exchange-rate.client';

@Injectable()
export class ExchangeRateClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    readonly configService: ConfigService,
  ) {
    this.exchangeApiUrl = configService.get('exchangeApi.url');
  }

  async fetchExchangeRates(): Promise<GetExchangeRatesDto> {
    const response = await firstValueFrom(
      this.httpService.get<GetExchangeRatesDto>(this.exchangeApiUrl),
    );
    return response.data;
  }
}
