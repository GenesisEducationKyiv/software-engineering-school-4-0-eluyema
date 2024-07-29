import { HttpException, Inject, Injectable } from "@nestjs/common";

import { TYPES } from "src/ioc";

import { RateService } from "./interfaces/rate.service.interface";
import { MetricsService } from "../../infrastructure/metrics/interfaces/metrics.service.interface";
import { Currency } from "../entities/currency.entity";
import { Rate } from "../entities/rate.entity";
import { RateRepository } from "../repositories/rate.repository";

@Injectable()
export class RateServiceImpl implements RateService {
  constructor(
    @Inject(TYPES.repositories.RateRepository)
    private rateRepository: RateRepository,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter("rate_requests", "Count of rate requests", [
      "status",
    ]);
    this.metricsService.initCounter("rate_updates", "Count of rate updates", [
      "status",
    ]);
  }

  async getRate(): Promise<Rate> {
    try {
      const rate = await this.rateRepository.findByName(Currency.UAH);
      if (!rate) {
        throw new HttpException("Rate didn't exist in DB", 404);
      }
      this.metricsService.incrementCounter("rate_requests", {
        status: "success",
      });
      return rate;
    } catch (err) {
      this.metricsService.incrementCounter("rate_requests", {
        status: "failed",
      });
      throw err;
    }
  }

  async updateRate(rate: Rate) {
    try {
      await this.rateRepository.createOrUpdate(rate);
      this.metricsService.incrementCounter("rate_updates", {
        status: "success",
      });
    } catch (err) {
      this.metricsService.incrementCounter("rate_updates", {
        status: "failed",
      });
      throw err;
    }
  }
}
