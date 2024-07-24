import { Injectable, Logger } from "@nestjs/common";

import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";
import { ExchangeRateService } from "src/domain/services/interfaces/exchange-rate.service.interface";

@Injectable()
export class LoggingExchangeRateServiceDecorator
  implements ExchangeRateService
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly decorated: ExchangeRateService,
    private readonly clientName: string,
  ) {}

  async getCurrentExchangeRate(): Promise<ExchangeRate> {
    this.logger.log(
      `Attempting to fetch exchange rates from ${this.clientName}`,
    );
    try {
      const rate = await this.decorated.getCurrentExchangeRate();
      this.logger.log(
        `${this.clientName} - Response: ${JSON.stringify(rate, null, " ")}`,
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
