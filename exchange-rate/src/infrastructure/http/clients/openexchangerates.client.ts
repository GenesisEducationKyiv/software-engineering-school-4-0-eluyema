import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";
import { ExchangeRateFactory } from "src/domain/factories/exchange-rate.factory";
import { AppConfigService } from "src/infrastructure/config/interfaces/app-config.service.interface";
import { TYPES } from "src/ioc";

import { OpenexchangeratesDto } from "./dto/openexchangerates.dto";
import { ExchangeRateClient } from "./interfaces/exchange-rate-client";
import { MetricsService } from "../../metrics/interfaces/metrics.service.interface";

@Injectable()
export class OpenexchangeratesClientImpl implements ExchangeRateClient {
  private exchangeApiUrl: string;

  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.exchangeApiUrl = appConfigService.exchangeApi.openexchangeratesUrl;
    this.metricsService.initCounter(
      "exchange_rate_fetched",
      "Fetch rate success",
      ["source", "status"],
    );
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      this.logger.log(
        `Fetch exchange rate from URL [${this.exchangeApiUrl}] started`,
      );
      const exchangeRatesDto = await firstValueFrom(
        this.httpService.get<OpenexchangeratesDto>(this.exchangeApiUrl),
      );
      this.metricsService.incrementCounter("exchange_rate_fetched", {
        source: "openexchangerates",
        status: "success",
      });
      this.logger.debug(
        `Fetched exchange rate body received from URL [${this.exchangeApiUrl}] throw exception: ${JSON.stringify(exchangeRatesDto.data)}`,
      );
      return ExchangeRateFactory.create(
        exchangeRatesDto.data.base,
        exchangeRatesDto.data.rates.UAH,
        new Date(),
      );
    } catch (err) {
      this.metricsService.incrementCounter("exchange_rate_fetched", {
        source: "openexchangerates",
        status: "failed",
      });
      this.logger.error(
        `Fetch exchange rate from URL [${this.exchangeApiUrl}] throw exception: ${err.message}`,
      );
      throw new Error("Request to get currency rate failed");
    }
  }
}
