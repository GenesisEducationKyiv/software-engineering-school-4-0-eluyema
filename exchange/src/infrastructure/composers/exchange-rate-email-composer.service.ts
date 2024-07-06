import { Inject, Injectable } from "@nestjs/common";

import { ExchangeRateEmailComposerService } from "./interfaces/exchange-rate-email-composer-service.interface";
import { Email } from "../../domain/entities/email.entity";
import { ExchangeRate } from "../../domain/entities/exchange-rate.entity";
import { AvailableTemplatesEnum } from "../../domain/entities/template.entity";
import { EmailFactory } from "../../domain/factories/email.factory";
import { TYPES } from "../../ioc";
import { TemplateService } from "../notification/interfaces/template.service.interface";

@Injectable()
export class ExchangeRateEmailComposerServiceImpl
  implements ExchangeRateEmailComposerService
{
  constructor(
    @Inject(TYPES.services.TemplateService)
    private readonly templateService: TemplateService,
  ) {}

  async composeExchangeRateEmail(
    exchangeRate: ExchangeRate,
    recipients: string[],
  ): Promise<Email> {
    const subject = "Daily Exchange Rate";

    const context = {
      rate: exchangeRate.rate,
      date: exchangeRate.date.toISOString(),
    };

    const html = await this.templateService.renderTemplate(
      AvailableTemplatesEnum.EXCHANGE_RATE,
      context,
    );

    return EmailFactory.create({ to: recipients, subject, html });
  }
}
