import { Inject, Injectable } from "@nestjs/common";

import { MailerService } from "./interfaces/mailer.service.interface";
import { ExchangeRateNotificationService } from "../../application/interfaces/exchange-rate-notification.service.interface";
import { ExchangeRate } from "../../domain/entities/exchange-rate.entity";
import { TYPES } from "../../ioc";
import { ExchangeRateEmailComposerService } from "../composers/interfaces/exchange-rate-email-composer-service.interface";

@Injectable()
export class ExchangeRateNotificationServiceImpl
  implements ExchangeRateNotificationService
{
  constructor(
    @Inject(TYPES.services.EmailService)
    private readonly mailerService: MailerService,
    @Inject(TYPES.infrastructure.ExchangeRateEmailComposerService)
    private readonly emailComposerService: ExchangeRateEmailComposerService,
  ) {}

  async sendExchangeRateNotification(
    exchangeRate: ExchangeRate,
    recipients: string[],
  ): Promise<void> {
    const email = await this.emailComposerService.composeExchangeRateEmail(
      exchangeRate,
      recipients,
    );
    await this.mailerService.sendEmail(email);
  }
}
