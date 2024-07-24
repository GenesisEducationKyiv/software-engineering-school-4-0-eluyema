import { Module } from "@nestjs/common";

import { NodemailerServiceImpl } from "src/infrastructure/email/nodemailer.service";
import { TYPES } from "src/ioc/types";

import { SendEmailApplicationImpl } from "./application/send-email.application";
import { MailerController } from "./controllers/mailer.controller";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";

const sendEmailApp = {
  provide: TYPES.applications.SendEmailApplication,
  useClass: SendEmailApplicationImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const emailService = {
  provide: TYPES.services.EmailService,
  useClass: NodemailerServiceImpl,
};

@Module({
  imports: [AppConfigModule],
  controllers: [MailerController],
  providers: [appConfigService, sendEmailApp, emailService],
})
export class AppModule {}
