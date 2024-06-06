import { Email } from '../../domain/entities/email.entity';

export interface EmailService {
  sendEmail(email: Email): Promise<void>;
  getSubscribers(): Promise<string[]>;
  formatExchangeRateEmail(exchangeRate: any): Email;
}
