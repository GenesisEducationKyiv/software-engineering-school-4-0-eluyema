import { Inject, Injectable } from "@nestjs/common";

import { ExchangeRateEmailComposerService } from "./interfaces/exchange-rate-email-composer-service.interface";
import { AvailableTemplatesEnum } from "../../../../mailer/src/domain/entities/template.entity";
import { Email } from "../../domain/entities/email.entity";
import { Rate } from "../../domain/entities/rate.entity";
import { EmailFactory } from "../../domain/factories/email.factory";
import { TYPES } from "../../ioc";
import { TemplateService } from "../template/interfaces/template.service.interface";

@Injectable()
export class ExchangeRateEmailComposerServiceImpl
  implements ExchangeRateEmailComposerService
{
  constructor(
    @Inject(TYPES.infrastructure.TemplateService)
    private readonly templateService: TemplateService,
  ) {}

  async composeExchangeRateEmail(
    rate: Rate,
    recipients: string[],
  ): Promise<Email> {
    const subject = "Daily Exchange Rate";

    const context = {
      rate: rate.rate,
      date: rate.date.toISOString(),
    };

    const html = await this.templateService.renderTemplate(
      AvailableTemplatesEnum.EXCHANGE_RATE,
      context,
    );

    return EmailFactory.create({ to: recipients, subject, html });
  }
}
