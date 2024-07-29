import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

import { NotifyCurrentExchangeRateApplication } from "src/application/interfaces/notify-current-exchange-rate.application.interface";
import { TYPES } from "src/ioc";

import { CurrentRateCronService } from "./interfaces/current-rate-cron.service.interface";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";
import { MetricsService } from "../metrics/interfaces/metrics.service.interface";

@Injectable()
export class CurrentRateCronServiceImpl implements CurrentRateCronService {
  private cronPattern: string;

  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(TYPES.applications.NotifyCurrentExchangeRateApplication)
    private readonly notifyCurrentExchangeRateApplication: NotifyCurrentExchangeRateApplication,
    @Inject(TYPES.infrastructure.AppConfigService)
    private readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "rate_update_cron",
      "Update rate cron counter",
    );
  }

  async onModuleInit() {
    try {
      this.logger.debug("Cron initialization started");
      this.cronPattern = this.appConfigService.cron.pattern;
      this.initializeCronJob();
      this.logger.debug("Cron initialization success");
    } catch (err) {
      this.logger.error("Cron initialization failed");
      throw err;
    }
  }

  private initializeCronJob() {
    const callback = async () => {
      try {
        await this.handleCron();
      } catch (err) {
        this.logger.error("Cron callback failed");
      }
    };

    const job = new CronJob(this.cronPattern, callback);
    this.schedulerRegistry.addCronJob(
      "notifyCurrentExchangeRateApplication",
      job,
    );
    job.start();
  }

  async handleCron() {
    this.logger.log("Rate update cron started");
    try {
      this.metricsService.incrementCounter("rate_update_cron");
      await this.notifyCurrentExchangeRateApplication.execute();
    } catch (err) {
      this.logger.error("Rate update cron failed! Error: " + err.message);
    }
  }
}
