import { Email } from "src/domain/entities/email.entity";
import { ExchangeRate } from "src/domain/entities/exchange-rate.entity";

export interface ExchangeRateEmailComposerService {
  composeExchangeRateEmail(
    exchangeRate: ExchangeRate,
    recipients: string[],
  ): Promise<Email>;
}
