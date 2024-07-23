import { Inject, Injectable } from "@nestjs/common";

import { Rate } from "src/domain/entities/rate.entity";
import { RateService } from "src/domain/services/interfaces/rate.service.interface";

import { UpdateExchangeRateApplication } from "./interfaces/update-exchange-rate.application.interface";
import { TYPES } from "../ioc";

@Injectable()
export class UpdateExchangeRateApplicationImpl
  implements UpdateExchangeRateApplication
{
  constructor(
    @Inject(TYPES.services.RateService)
    private readonly rateService: RateService,
  ) {}

  async execute(rate: Rate): Promise<void> {
    await this.rateService.updateRate(rate);
  }
}
