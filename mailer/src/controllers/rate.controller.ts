import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { UpdateExchangeRateApplication } from "src/application/interfaces/update-exchange-rate.application.interface";
import { RateFactory } from "src/domain/factories/rate.factory";
import { Event } from "src/infrastructure/notification/event";
import { TYPES } from "src/ioc";

import { RateUpdatedDto } from "./dtos/rate-updated.dto";

@Controller()
export class RateController {
  constructor(
    @Inject(TYPES.applications.UpdateExchangeRateApplication)
    private readonly updateExchangeRateApplication: UpdateExchangeRateApplication,
  ) {}

  @EventPattern("rate-update")
  async subscriptionCreated(
    @Payload(ValidationPipe) value: Event<RateUpdatedDto>,
  ) {
    const rate = RateFactory.create({
      rate: value.data.rate,
      name: value.data.name,
      date: new Date(value.data.timestamp),
    });

    await this.updateExchangeRateApplication.execute(rate);
  }
}
