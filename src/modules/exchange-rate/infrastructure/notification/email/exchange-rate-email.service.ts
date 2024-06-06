import { Injectable, Inject } from '@nestjs/common';
import { ExchangeRateNotificationService } from '../../../interfaces/notification/exchange-rate-notification.service.interface';
import { EmailService } from 'src/modules/mailer/interfaces/services/email.service.interface';
import { TYPES as MAILER_TYPES } from 'src/modules/mailer/interfaces/types';
import { ExchangeRate } from '../../../domain/entities/exchange-rate.entity';
import { Email } from 'src/modules/mailer/domain/entities/email.entity';
import { SubscriptionService } from 'src/modules/subscription/domain/services/subscription.service';
import { TYPES as SUBSCRIPTION_TYPES } from 'src/modules/subscription/interfaces/types';
import { TemplateService } from 'src/modules/mailer/interfaces/services/template.service.interface';
import { AvailableTemplatesEnum } from 'src/modules/mailer/domain/entities/template.entity';

@Injectable()
export class ExchangeRateEmailService
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
