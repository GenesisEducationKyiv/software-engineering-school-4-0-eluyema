import { Email } from '../../domain/entities/email.entity';

export interface SendEmailApplication {
  execute(email: Email): Promise<void>;
}
