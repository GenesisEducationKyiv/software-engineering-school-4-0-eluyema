import { Inject, Injectable, Logger } from "@nestjs/common";

import { Rate } from "src/domain/entities/rate.entity";
import { RateService } from "src/domain/services/interfaces/rate.service.interface";

import { UpdateExchangeRateApplication } from "./interfaces/update-exchange-rate.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class UpdateExchangeRateApplicationImpl
  implements UpdateExchangeRateApplication
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.services.RateService)
    private readonly rateService: RateService,
  ) {}

  async execute(rate: Rate): Promise<void> {
    try {
      this.logger.log(`Update rate ${JSON.stringify(rate)} started`);
      await this.rateService.updateRate(rate);
      this.logger.log(`Update rate ${JSON.stringify(rate)} success`);
    } catch (err) {
      this.logger.warn(`Update rate ${JSON.stringify(rate)} failed`);
      throw err;
    }
  }
}
