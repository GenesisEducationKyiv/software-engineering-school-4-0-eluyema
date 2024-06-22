import { Injectable } from '@nestjs/common';

import { ChainableExchangeRateService } from './interfaces/chainable-exchange-rate.service.interface';
import { ExchangeRate } from '../entities/exchange-rate.entity';

@Injectable()
export abstract class BaseExchangeRateService
  implements ChainableExchangeRateService
{
  private nextService: ChainableExchangeRateService | null = null;

  setNext(next: ChainableExchangeRateService): ChainableExchangeRateService {
    this.nextService = next;
    return next;
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    try {
      return await this.fetchExchangeRates();
    } catch (error) {
      if (this.nextService) {
        return this.nextService.getCurrentExchangeRate();
      }
      throw new Error(
        'Failed to fetch exchange rates from all available services.',
      );
    }
  }

  protected abstract fetchExchangeRates(): Promise<ExchangeRate>;

  static chainServices(
    services: BaseExchangeRateService[],
  ): BaseExchangeRateService {
    for (let i = 0; i < services.length - 1; i++) {
      services[i].setNext(services[i + 1]);
    }
    return services[0];
  }
}
