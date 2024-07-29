import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { PrivatbankDto } from "./dto/privatbank.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";
import { ExchangeRate } from "../../../domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "../../../domain/factories/exchange-rate.factory";
import { TYPES } from "../../../ioc";
import { AppConfigService } from "../../config/interfaces/app-config.service.interface";
import { MetricsService } from "../../metrics/interfaces/metrics.service.interface";

@Injectable()
export class PrivatbankClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.privatbankUrl;

    this.metricsService.initCounter(
      "exchange_rate_fetched",
      "Fetch rate failed",
      ["source", "status"],
    );
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      this.logger.log(
        `Fetch exchange rate from URL [${this.exchangeApiUrl}] started`,
      );
      const exchangeRatesDto = await firstValueFrom(
        this.httpService.get<PrivatbankDto>(this.exchangeApiUrl),
      );
      this.logger.debug(
        `Fetched exchange rate body received from URL [${this.exchangeApiUrl}] throw exception: ${JSON.stringify(exchangeRatesDto.data)}`,
      );
      this.metricsService.incrementCounter("exchange_rate_fetched", {
        status: "success",
        source: "privatbank",
      });
      return ExchangeRateFactory.create(
        exchangeRatesDto.data[1].ccy,
        Number(exchangeRatesDto.data[1].sale),
        new Date(),
      );
    } catch (err) {
      this.metricsService.incrementCounter("exchange_rate_fetched", {
        source: "privatbank",
        status: "failed",
      });
      this.logger.error(
        `Fetch exchange rate from URL [${this.exchangeApiUrl}] throw exception: ${err.message}`,
      );

      throw new Error("Request to get currency rate failed");
    }
  }
}
