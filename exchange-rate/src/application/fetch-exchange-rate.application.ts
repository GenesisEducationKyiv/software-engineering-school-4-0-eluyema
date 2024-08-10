import { Inject, Injectable, Logger } from "@nestjs/common";

import { FetchExchangeRateApplication } from "./interfaces/fetch-exchange-rate.application.interface";
import { ExchangeRate } from "../domain/entities/exchange-rate.entity";
import { ExchangeRateService } from "../domain/services/interfaces/exchange-rate.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class FetchExchangeRateApplicationImpl
  implements FetchExchangeRateApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async execute(): Promise<ExchangeRate> {
    try {
      const data = await this.exchangeRateService.getCurrentExchangeRate();
      this.logger.log(`Exchange rate fetched "${JSON.stringify(data)}"`);
      return data;
    } catch (err) {
      this.logger.error("Fetching failed! Error: " + err.message);
      throw err;
    }
  }
}
