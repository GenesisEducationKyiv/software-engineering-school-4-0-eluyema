import { Inject, Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

import { NotifyRateSubscribersApplication } from "src/application/interfaces/notify-rate-subscribers.application.interface";
import { TYPES } from "src/ioc";

import { NotifyRateSubscribtionCronService } from "./interfaces/notify-rate-subscribtion-cron.service.interface";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";
import { MetricsService } from "../metrics/interfaces/metrics.service.interface";

@Injectable()
export class NotifyRateSubscribtionCronServiceImpl
  implements NotifyRateSubscribtionCronService
{
  private cronPattern: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(TYPES.applications.NotifyRateSubscribersApplication)
    private readonly notifyRateSubscribersApplication: NotifyRateSubscribersApplication,
    @Inject(TYPES.infrastructure.AppConfigService)
    private readonly appConfigService: AppConfigService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "notification_mailer_cron",
      "Count of notification mail cron",
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
    this.schedulerRegistry.addCronJob("notifyRateSubscribers", job);
    job.start();
  }

  async handleCron() {
    this.metricsService.incrementCounter("notification_mailer_cron");
    await this.notifyRateSubscribersApplication.execute();
  }
}
