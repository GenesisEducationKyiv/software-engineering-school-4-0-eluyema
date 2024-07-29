import { Inject, Injectable, Logger } from "@nestjs/common";

import { Rate } from "src/domain/entities/rate.entity";

import { ExchangeRateNotificationService } from "../../application/interfaces/exchange-rate-notification.service.interface";
import { MailerService } from "../../application/interfaces/mailer.service.interface";
import { TYPES } from "../../ioc";
import { ExchangeRateEmailComposerService } from "../composers/interfaces/exchange-rate-email-composer-service.interface";
import { MetricsService } from "../metrics/interfaces/metrics.service.interface";

@Injectable()
export class ExchangeRateNotificationServiceImpl
  implements ExchangeRateNotificationService
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(TYPES.infrastructure.MailerService)
    private readonly mailerService: MailerService,
    @Inject(TYPES.infrastructure.ExchangeRateEmailComposerService)
    private readonly emailComposerService: ExchangeRateEmailComposerService,
    @Inject(TYPES.infrastructure.MetricsService)
    private readonly metricsService: MetricsService,
  ) {
    this.metricsService.initCounter(
      "exchange_rate_mail_notification",
      "Count of exchange rate mail notification",
      ["status"],
    );
  }

  async sendExchangeRateNotification(
    rate: Rate,
    recipients: string[],
  ): Promise<void> {
    try {
      this.logger.log(
        `Start compose exchange rate email for rate (${JSON.stringify(rate)}) and send to subscriptions (${recipients.length} amount)`,
      );
      const email = await this.emailComposerService.composeExchangeRateEmail(
        rate,
        recipients,
      );
      this.logger.log(
        `Email successfully composed for rate (${JSON.stringify(rate)}) and subscriptions (${recipients.length} amount)`,
      );
      await this.mailerService.sendEmail(email);
      this.logger.log(
        `Email successfully sent for rate (${JSON.stringify(rate)}) and subscriptions (${recipients.length} amount)`,
      );
      this.metricsService.incrementCounter("exchange_rate_mail_notification", {
        status: "success",
      });
    } catch (err) {
      this.logger.error(
        `Failed compose exchange rate email for rate (${JSON.stringify(rate)}) and ` +
          `subscriptions (${recipients.length} amount)! Error: ${err.message}`,
      );
      this.metricsService.incrementCounter("exchange_rate_mail_notification", {
        status: "failed",
      });
      throw err;
    }
  }
}
