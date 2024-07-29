import { Controller, Get, Inject, Res, UseInterceptors } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { MetricsService } from "../infrastructure/metrics/interfaces/metrics.service.interface";
import { MetricsInterceptor } from "../infrastructure/metrics/metrics.interceptor";
import { TYPES } from "../ioc";

@UseInterceptors(MetricsInterceptor)
@Controller("metrics")
export class MetricsController {
  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async getMetrics(@Res() res: FastifyReply): Promise<void> {
    res.header("Content-Type", this.metricsService.getMetricsContentType());
    const data = await this.metricsService.getMetrics();

    await res.send(data);
  }
}
