import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { SendEmailApplication } from "src/application/interfaces/send-email.application.interface";
import { TYPES } from "src/ioc";

import { SendEmailsDto } from "./dtos/send-emails.dto";

@Controller()
export class MailerController {
  constructor(
    @Inject(TYPES.applications.SendEmailApplication)
    private readonly sendEmailApp: SendEmailApplication,
  ) {}

  @EventPattern("send-emails")
  async count(@Payload(ValidationPipe) value: SendEmailsDto) {
    await this.sendEmailApp.execute(value);
  }
}
