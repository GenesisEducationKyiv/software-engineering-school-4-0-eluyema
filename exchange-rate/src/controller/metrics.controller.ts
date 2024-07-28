import { Controller, Get, Inject, Res } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { MetricsService } from "../infrastructure/metrics/interfaces/metrics.service.interface";
import { TYPES } from "../ioc";

@Controller("metrics")
export class MetricsController {
  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async getMetrics(@Res() res: FastifyReply): Promise<string> {
    res.header("Content-Type", this.metricsService.getMetricsContentType());
    return this.metricsService.getMetrics();
  }
}
