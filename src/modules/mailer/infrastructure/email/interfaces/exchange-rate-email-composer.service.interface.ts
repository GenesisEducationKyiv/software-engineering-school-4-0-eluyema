import { ExchangeRate } from 'src/modules/exchange-rate/domain/entities/exchange-rate.entity';
import { Email } from 'src/modules/mailer/domain/entities/email.entity';

export interface ExchangeRateEmailComposerService {
  composeExchangeRateEmail(
    exchangeRate: ExchangeRate,
    recipients: string[],
  ): Promise<Email>;
}
