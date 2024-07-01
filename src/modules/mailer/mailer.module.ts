import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc';

import { SendEmailApplicationImpl } from './application/send-email.application';
import { NodemailerServiceImpl } from './infrastructure/email/nodemailer.service';
import { HandlebarsTemplateServiceImpl } from './infrastructure/template/template.service';
import { TYPES } from './ioc/types';

const sendEmailApp = {
  provide: TYPES.applications.SendEmailApplication,
  useClass: SendEmailApplicationImpl,
};

const appConfigService = {
  provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
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
  providers: [appConfigService, sendEmailApp, templateService, emailService],
  exports: [emailService, templateService],
})
export class MailerModule {}
