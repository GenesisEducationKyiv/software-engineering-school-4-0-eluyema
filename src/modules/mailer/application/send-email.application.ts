import { Inject, Injectable } from '@nestjs/common';

import { MailerService } from './interfaces/mailer.service.interface';
import { SendEmailApplication } from './interfaces/send-email.application.interface';
import { Email } from '../domain/entities/email.entity';
import { TYPES } from '../ioc/types';

@Injectable()
export class SendEmailApplicationImpl implements SendEmailApplication {
  constructor(
    @Inject(TYPES.services.EmailService)
    private readonly emailService: MailerService,
  ) {}

  async execute(email: Email): Promise<void> {
    await this.emailService.sendEmail(email);
  }
}
