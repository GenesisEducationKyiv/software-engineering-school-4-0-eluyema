import { Controller, Get, Inject, UseInterceptors } from "@nestjs/common";

import { FetchExchangeRateApplication } from "../application/interfaces/fetch-exchange-rate.application.interface";
import { MetricsInterceptor } from "../infrastructure/metrics/metrics.interceptor";
import { TYPES } from "../ioc/types";

@UseInterceptors(MetricsInterceptor)
@Controller("rate")
export class HttpExchangeRateController {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
  ) {}

  @Get("/")
  async getExchangeRate(): Promise<number> {
    const exchangeRate = await this.fetchExchangeRateApp.execute();

    return exchangeRate.rate;
  }
}
