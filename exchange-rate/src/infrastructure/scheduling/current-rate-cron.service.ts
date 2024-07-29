import { Inject, Injectable } from "@nestjs/common";
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
    this.cronPattern = this.appConfigService.cron.pattern;
    this.initializeCronJob();
  }

  private initializeCronJob() {
    const callback = async () => {
      try {
        await this.handleCron();
      } catch (err) {
        console.error(err);
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
    this.metricsService.incrementCounter("rate_update_cron");
    await this.notifyCurrentExchangeRateApplication.execute();
  }
}
