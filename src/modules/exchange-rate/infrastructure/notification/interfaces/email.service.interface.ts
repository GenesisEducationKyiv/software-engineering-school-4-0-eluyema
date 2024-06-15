import { Email } from 'src/modules/mailer/domain/entities/email.entity';

export interface EmailService {
  sendEmail(email: Email): Promise<void>;
}
