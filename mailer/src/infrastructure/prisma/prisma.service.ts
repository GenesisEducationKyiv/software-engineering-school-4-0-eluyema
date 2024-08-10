import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { TYPES } from "../../ioc";
import { MetricsService } from "../metrics/interfaces/metrics.service.interface";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    super();
  }
  async onModuleInit() {
    try {
      this.logger.log(`Prisma connection started`);
      await this.$connect();
      this.logger.log(`Prisma connection success`);
      const getPrismaMetrics = () => this.$metrics.prometheus();

      this.metricsService.addMetricHandler("prisma metrics", getPrismaMetrics);
    } catch (err) {
      this.logger.error(`Prisma connection failed! Error: ${err.message}`);
      throw err;
    }
  }
}
