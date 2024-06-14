// src/mailer/services/email-composer.service.ts
import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRate } from 'src/modules/exchange-rate/domain/entities/exchange-rate.entity';
import { TemplateService } from 'src/modules/exchange-rate/infrastructure/notification/interfaces/template.service.interface';
import { Email } from 'src/modules/mailer/domain/entities/email.entity';
import { AvailableTemplatesEnum } from 'src/modules/mailer/domain/entities/template.entity';
import { TYPES as MAILER_TYPES } from 'src/modules/mailer/infrastructure/ioc';

import { ExchangeRateEmailComposerService } from '../interfaces/exchange-rate-email-composer.service.interface';

@Injectable()
export class ExchangeRateEmailComposerServiceImpl
  implements ExchangeRateEmailComposerService
{
  constructor(
    @Inject(MAILER_TYPES.services.TemplateService)
    private readonly templateService: TemplateService,
  ) {}

  async composeExchangeRateEmail(
    exchangeRate: ExchangeRate,
    recipients: string[],
  ): Promise<Email> {
    const subject = 'Daily Exchange Rate';

    const context = {
      rate: exchangeRate.rate,
      date: exchangeRate.date.toISOString(),
    };

    const html = await this.templateService.renderTemplate(
      AvailableTemplatesEnum.EXCHANGE_RATE,
      context,
    );
    return new Email(recipients, subject, '', html);
  }
}
