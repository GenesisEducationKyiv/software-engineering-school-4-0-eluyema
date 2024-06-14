import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SendEmailApplicationImpl } from './application/send-email.application';
import { NodemailerServiceImpl } from './infrastructure/email/nodemailer.service';
import { HandlebarsTemplateServiceImpl } from './infrastructure/template/template.service';
import { TYPES } from './infrastructure/ioc/types';

const sendEmailApp = {
  provide: TYPES.applications.SendEmailApplication,
  useClass: SendEmailApplicationImpl,
};

const emailService = {
  provide: TYPES.services.EmailService,
  useClass: NodemailerServiceImpl,
};

const templateService = {
  provide: TYPES.services.TemplateService,
  useClass: HandlebarsTemplateServiceImpl,
};

@Module({
  imports: [ConfigModule],
  providers: [sendEmailApp, templateService, emailService],
  exports: [emailService, templateService],
})
export class MailerModule {}
