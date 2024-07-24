import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { SendEmailsDto } from "./dtos/send-emails.dto";
import { SendExchangeRateToSubscribersApplication } from "../application/interfaces/send-exchange-rate-to-subscribers.application.interface";
import { Event } from "../infrastructure/notification/event";
import { TYPES } from "../ioc/types";

@Controller()
export class KafkaExchangeRateController {
  constructor(
    @Inject(TYPES.applications.SendExchangeRateToSubscribersApplication)
    private readonly sendExchangeRateToSubscribersApp: SendExchangeRateToSubscribersApplication,
  ) {}

  @EventPattern("exchange-rate-notification-requested")
  async count(@Payload(ValidationPipe) value: Event<SendEmailsDto>) {
    await this.sendExchangeRateToSubscribersApp.execute(value.data.emails);
  }
}
