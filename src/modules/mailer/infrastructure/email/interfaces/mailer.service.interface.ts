import { Email } from '../../../domain/entities/email.entity';

export interface MailerService {
  sendEmail(email: Email): Promise<void>;
}
