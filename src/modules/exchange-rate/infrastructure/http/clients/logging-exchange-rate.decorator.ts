import { Injectable, Logger } from '@nestjs/common';

import { ExchangeRate } from 'src/modules/exchange-rate/domain/entities/exchange-rate.entity';
import { BaseExchangeRateService } from 'src/modules/exchange-rate/domain/services/exchange-rate.service';

@Injectable()
export class LoggingExchangeRateServiceDecorator extends BaseExchangeRateService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly decorated: BaseExchangeRateService,
    private readonly clientName: string,
  ) {
    super();
  }

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    this.logger.log(
      `Attempting to fetch exchange rates from ${this.clientName}`,
    );
    try {
      const rate = await this.decorated.getCurrentExchangeRate();
      this.logger.log(
        `${this.clientName} - Response: ${JSON.stringify(rate, null, ' ')}`,
      );
      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to fetch exchange rates from ${this.clientName}: ${error.message}`,
      );
      throw error;
    }
  }

  protected async fetchExchangeRates(): Promise<ExchangeRate> {
    return this.decorated.getCurrentExchangeRate();
  }
}
