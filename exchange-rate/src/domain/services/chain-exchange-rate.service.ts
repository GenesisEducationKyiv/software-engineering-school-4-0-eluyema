import { Injectable } from "@nestjs/common";

import { ChainExchangeRateService } from "./interfaces/chain-exchange-rate.service.interface";
import { ExchangeRateClient } from "./interfaces/exchange-rate.client.interface";
import { ExchangeRate } from "../entities/exchange-rate.entity";

@Injectable()
export class ChainExchangeRateServiceImpl implements ChainExchangeRateService {
  private nextService: ChainExchangeRateService | null = null;

  constructor(private client: ExchangeRateClient) {}

  setNext(next: ChainExchangeRateService): ChainExchangeRateService {
    this.nextService = next;
    return next;
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      return await this.client.getCurrentExchangeRate();
    } catch (error) {
      if (this.nextService) {
        return this.nextService.getCurrentExchangeRate();
      }
      throw new Error(
        "Failed to fetch exchange rates from all available services.",
      );
    }
  }

  static generateChain(
    clients: ExchangeRateClient[],
  ): ChainExchangeRateService {
    const chainServices: ChainExchangeRateService[] = [];

    for (let i = 0; i < clients.length - 1; i++) {
      const currentClient: ExchangeRateClient = clients[i];
      const newChainService = new ChainExchangeRateServiceImpl(currentClient);

      chainServices.push(newChainService);

      if (i !== 0) {
        chainServices[i - 1].setNext(newChainService);
      }
    }

    return chainServices[0];
  }
}
