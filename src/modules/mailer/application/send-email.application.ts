import { Inject, Injectable } from '@nestjs/common';

import { Email } from '../domain/entities/email.entity';
import { SendEmailApplication } from '../interfaces/applications/send-email.application.interface';
import { EmailService } from '../interfaces/services/email.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class SendEmailApplicationImpl implements SendEmailApplication {
  constructor(
    @Inject(TYPES.services.EmailService)
    private readonly emailService: EmailService,
  ) {}

  async execute(email: Email): Promise<void> {
    await this.emailService.sendEmail(email);
  }
}
