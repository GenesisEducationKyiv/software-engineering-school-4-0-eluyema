import { HttpException, Inject, Injectable } from "@nestjs/common";

import { TYPES } from "src/ioc";

import { RateService } from "./interfaces/rate.service.interface";
import { Currency } from "../entities/currency.entity";
import { Rate } from "../entities/rate.entity";
import { RateRepository } from "../repositories/rate.repository";

@Injectable()
export class RateServiceImpl implements RateService {
  constructor(
    @Inject(TYPES.repositories.RateRepository)
    private rateRepository: RateRepository,
  ) {}

  async getRate(): Promise<Rate> {
    const rate = await this.rateRepository.findByName(Currency.UAH);
    if (!rate) {
      throw new HttpException("Rate didn't exist in DB", 404);
    }
    return rate;
  }

  async updateRate(rate: Rate) {
    await this.rateRepository.createOrUpdate(rate);
  }
}
