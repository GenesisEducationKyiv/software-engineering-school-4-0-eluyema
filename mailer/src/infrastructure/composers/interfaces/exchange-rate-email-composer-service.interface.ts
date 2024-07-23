import { Email } from "src/domain/entities/email.entity";
import { Rate } from "src/domain/entities/rate.entity";

export interface ExchangeRateEmailComposerService {
  composeExchangeRateEmail(
    exchangeRate: Rate,
    recipients: string[],
  ): Promise<Email>;
}
