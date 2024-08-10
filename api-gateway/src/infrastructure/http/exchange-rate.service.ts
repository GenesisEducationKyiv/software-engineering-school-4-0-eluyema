import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { ExchangeRateService } from "./interfaces/exchange-rate.service.interface";
import { TYPES } from "../../ioc";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";

@Injectable()
export class ExchangeRateServiceImpl implements ExchangeRateService {
  private exchangeRate: string;

  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.exchangeRate = this.appConfigService.microservicesApi.exchangeRateUrl;
  }

  async fetchExchangeRate() {
    try {
      this.logger.log(`Fetch exchange rate started`);
      const response = await firstValueFrom(
        this.httpService.get<void>(`${this.exchangeRate}/rate`),
      );
      this.logger.log(`Fetch exchange rate success`);
      return response.data;
    } catch (err) {
      this.logger.error(`Fetch exchange rate failed! Error: ${err.message}`);
      throw err;
    }
  }
}
