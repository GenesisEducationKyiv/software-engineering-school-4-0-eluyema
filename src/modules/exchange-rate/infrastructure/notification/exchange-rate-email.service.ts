import { Inject, Injectable } from '@nestjs/common';

import { Email } from 'src/modules/mailer/domain/entities/email.entity';
import { AvailableTemplatesEnum } from 'src/modules/mailer/domain/entities/template.entity';
import { TYPES as MAILER_TYPES } from 'src/modules/mailer/infrastructure/ioc';
import { SubscriptionService } from 'src/modules/subscription/domain/services/interfaces/subscription.service.interface';
import { TYPES as SUBSCRIPTION_TYPES } from 'src/modules/subscription/infrastructure/ioc';

import { EmailService } from './interfaces/email.service.interface';
import { ExchangeRateNotificationService } from './interfaces/exchange-rate-notification.service.interface';
import { TemplateService } from './interfaces/template.service.interface';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateEmailServiceImpl
  implements ExchangeRateNotificationService
{
  constructor(
    @Inject(SUBSCRIPTION_TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(MAILER_TYPES.services.EmailService)
    private readonly emailService: EmailService,
    @Inject(MAILER_TYPES.services.TemplateService)
    private readonly templateService: TemplateService,
  ) {}

  async sendExchangeRateNotification(
    exchangeRate: ExchangeRate,
  ): Promise<void> {
    const subject = 'Daily Exchange Rate';
    const template = AvailableTemplatesEnum.EXCHANGE_RATE;

    const context = {
      rate: exchangeRate.rate,
      date: exchangeRate.date.toISOString(),
    };

    const recipients = await this.subscriptionService.getSubscribers();
    const html = await this.templateService.renderTemplate(template, context);

    const email = new Email(recipients, subject, '', html);

    await this.emailService.sendEmail(email);
  }
}
