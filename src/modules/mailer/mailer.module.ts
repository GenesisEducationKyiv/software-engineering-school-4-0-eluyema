import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TYPES } from './interfaces/types';
import { SendEmailApplicationImpl } from './application/send-email.application';
import { NodemailerService } from './infrastructure/implementations/nodemailer.service';
import { HandlebarsTemplateService } from './infrastructure/implementations/template.service';

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
