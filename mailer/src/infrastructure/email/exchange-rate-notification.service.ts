import { Inject, Injectable } from "@nestjs/common";

import { Rate } from "src/domain/entities/rate.entity";

import { ExchangeRateNotificationService } from "../../application/interfaces/exchange-rate-notification.service.interface";
import { MailerService } from "../../application/interfaces/mailer.service.interface";
import { TYPES } from "../../ioc";
import { ExchangeRateEmailComposerService } from "../composers/interfaces/exchange-rate-email-composer-service.interface";

@Injectable()
export class ExchangeRateNotificationServiceImpl
  implements ExchangeRateNotificationService
{
  constructor(
    @Inject(TYPES.infrastructure.MailerService)
    private readonly mailerService: MailerService,
    @Inject(TYPES.infrastructure.ExchangeRateEmailComposerService)
    private readonly emailComposerService: ExchangeRateEmailComposerService,
  ) {}

  async sendExchangeRateNotification(
    rate: Rate,
    recipients: string[],
  ): Promise<void> {
    const email = await this.emailComposerService.composeExchangeRateEmail(
      rate,
      recipients,
    );
    await this.mailerService.sendEmail(email);
  }
}
