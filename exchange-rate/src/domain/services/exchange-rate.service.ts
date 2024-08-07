import { Inject, Injectable } from "@nestjs/common";

import { ChainExchangeRateServiceImpl } from "./chain-exchange-rate.service";
import { ChainExchangeRateService } from "./interfaces/chain-exchange-rate.service.interface";
import { ExchangeRateClient } from "./interfaces/exchange-rate.client.interface";
import { ExchangeRateService } from "./interfaces/exchange-rate.service.interface";
import { TYPES } from "../../ioc";
import { ExchangeRate } from "../entities/exchange-rate.entity";

@Injectable()
export class ExchangeRateServiceImpl implements ExchangeRateService {
  private chainExchangeRateService: ChainExchangeRateService;

  constructor(
    @Inject(TYPES.infrastructure.ExchangeRateClients)
    clients: ExchangeRateClient[],
  ) {
    this.chainExchangeRateService = ChainExchangeRateServiceImpl.generateChain([
      ...clients,
    ]);
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      return await this.chainExchangeRateService.getCurrentExchangeRate();
    } catch (error) {
      throw new Error(
        "Failed to fetch exchange rates from all available services.",
      );
    }
  }
}
