import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { ExchangeRateService } from "./interfaces/exchange-rate.service.interface";
import { TYPES } from "../../ioc";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";

@Injectable()
export class ExchangeRateServiceImpl implements ExchangeRateService {
  private exchangeRate: string;

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.exchangeRate = this.appConfigService.microservicesApi.exchangeRateUrl;
  }

  async fetchExchangeRate() {
    const response = await firstValueFrom(
      this.httpService.get<void>(`${this.exchangeRate}/rate`),
    );

    return response.data;
  }
}
