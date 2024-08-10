import {
  Controller,
  Get,
  Inject,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";

import { FetchExchangeRateApplication } from "../application/interfaces/fetch-exchange-rate.application.interface";
import { HttpMetricsInterceptor } from "../infrastructure/metrics/http-metrics.interceptor";
import { HttpExceptionFilter } from "../infrastructure/nestjs/filters/http-exception.filter";
import { TYPES } from "../ioc/types";

@UseInterceptors(HttpMetricsInterceptor)
@UseFilters(new HttpExceptionFilter())
@Controller("rate")
export class ExchangeRateController {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
  ) {}

  @Get("/")
  async getExchangeRate(): Promise<unknown> {
    return await this.fetchExchangeRateApp.execute();
  }
}
