import { Body, Controller, Inject, Post } from "@nestjs/common";

import { SendEmailApplication } from "src/application/interfaces/send-email.application.interface";
import { TYPES } from "src/ioc";

import { SendEmailsDto } from "./dtos/send-emails.dto";

@Controller("mailer")
export class MailerController {
  constructor(
    @Inject(TYPES.applications.SendEmailApplication)
    private readonly sendEmailApp: SendEmailApplication,
  ) {}

  @Post("/send-emails")
  async sendEmails(@Body() dto: SendEmailsDto): Promise<void> {
    return await this.sendEmailApp.execute(dto);
  }
}
