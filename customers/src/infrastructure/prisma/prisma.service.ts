import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { TYPES } from "../../ioc";
import { MetricsService } from "../metrics/interfaces/metrics.service.interface";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();

    const getPrismaMetrics = () => this.$metrics.prometheus();

    this.metricsService.addMetricHandler("prisma metrics", getPrismaMetrics);
  }
}
