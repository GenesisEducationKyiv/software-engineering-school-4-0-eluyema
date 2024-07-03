import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateEmailComposerService } from 'src/modules/mailer/infrastructure/email/interfaces/exchange-rate-email-composer.service.interface';
import { MailerService } from 'src/modules/mailer/infrastructure/email/interfaces/mailer.service.interface';
import { TYPES as MAILER_TYPES } from 'src/modules/mailer/infrastructure/ioc';

import { ExchangeRateNotificationService } from './interfaces/exchange-rate-notification.service.interface';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { TYPES as EXCHANGE_RATE_TYPES } from '../../infrastructure/ioc';

@Injectable()
export class ExchangeRateNotificationServiceImpl
  implements ExchangeRateNotificationService
{
  constructor(
    @Inject(MAILER_TYPES.services.EmailService)
    private readonly mailerService: MailerService,
    @Inject(EXCHANGE_RATE_TYPES.infrastructure.ExchangeRateEmailComposerService)
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
