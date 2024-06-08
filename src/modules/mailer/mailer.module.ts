import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SendEmailApplicationImpl } from './application/send-email.application';
import { NodemailerService } from './infrastructure/implementations/nodemailer.service';
import { HandlebarsTemplateService } from './infrastructure/implementations/template.service';
import { TYPES } from './interfaces/types';

const sendEmailApp = {
  provide: TYPES.applications.SendEmailApplication,
  useClass: SendEmailApplicationImpl,
};

const emailService = {
  provide: TYPES.services.EmailService,
  useClass: NodemailerService,
};

const templateService = {
  provide: TYPES.services.TemplateService,
  useClass: HandlebarsTemplateService,
};

@Module({
  imports: [ConfigModule],
  providers: [sendEmailApp, templateService, emailService],
  exports: [emailService, templateService],
})
export class MailerModule {}
