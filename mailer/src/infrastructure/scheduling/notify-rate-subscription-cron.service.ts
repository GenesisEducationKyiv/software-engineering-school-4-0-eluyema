import { Inject, Injectable, Logger } from "@nestjs/common";
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

  private readonly logger = new Logger(this.constructor.name);

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
    try {
      this.logger.log("Notification rate cron initialization started");
      this.cronPattern = this.appConfigService.cron.pattern;
      this.initializeCronJob();
    } catch (err) {
      this.logger.error(
        `Notification rate cron initialization failed! Error: ${err.message}`,
      );
      throw err;
    }
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
    try {
      this.logger.log(`Notification rate cron job started`);
      this.metricsService.incrementCounter("notification_mailer_cron");
      await this.notifyRateSubscribersApplication.execute();
      this.logger.log(`Notification rate cron job success`);
    } catch (err) {
      this.logger.error(
        `Notification rate cron job failed! Error: ${err.message}`,
      );
      throw err;
    }
  }
}
