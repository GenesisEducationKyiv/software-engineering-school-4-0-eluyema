import { Inject, Injectable } from "@nestjs/common";

import { FetchExchangeRateApplication } from "./interfaces/fetch-exchange-rate.application.interface";
import { ExchangeRateService } from "../infrastructure/http/interfaces/exchange-rate.service.interface";
import { TYPES } from "../ioc/types";

@Injectable()
export class FetchExchangeRateApplicationImpl
  implements FetchExchangeRateApplication
{
  constructor(
    @Inject(TYPES.infrastructure.ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async execute(): Promise<unknown> {
    return await this.exchangeRateService.fetchExchangeRate();
  }
}
