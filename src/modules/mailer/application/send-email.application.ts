import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import { EmailService } from '../interfaces/services/email.service.interface';
import { SendEmailApplication } from '../interfaces/applications/send-email.application.interface';
import { Email } from '../domain/entities/email.entity';

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
