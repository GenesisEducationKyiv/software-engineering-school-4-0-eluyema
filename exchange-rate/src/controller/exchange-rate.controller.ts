import { Body, Controller, Get, Inject, Post } from "@nestjs/common";

import { SendEmailsDto } from "./dtos/send-emails.dto";
import { FetchExchangeRateApplication } from "../application/interfaces/fetch-exchange-rate.application.interface";
import { SendExchangeRateToSubscribersApplication } from "../application/interfaces/send-exchange-rate-to-subscribers.application.interface";
import { TYPES } from "../ioc/types";

@Controller("rate")
export class ExchangeRateController {
  constructor(
    @Inject(TYPES.applications.FetchExchangeRateApplication)
    private readonly fetchExchangeRateApp: FetchExchangeRateApplication,
    @Inject(TYPES.applications.SendExchangeRateToSubscribersApplication)
    private readonly sendExchangeRateToSubscribersApp: SendExchangeRateToSubscribersApplication,
  ) {}

  @Get("/")
  async getExchangeRate(): Promise<number> {
    const exchangeRate = await this.fetchExchangeRateApp.execute();

    return exchangeRate.rate;
  }

  @Post("/send-emails")
  async sendEmails(@Body() dto: SendEmailsDto): Promise<void> {
    return await this.sendExchangeRateToSubscribersApp.execute(dto.emails);
  }
}
