import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";

import { RemoveSubscriptionApplication } from "src/application/interfaces/remove-subscription.application.interface";

import { CreateSubscriptionDto } from "./dtos/create-subscription.dto";
import { CreateSubscriptionApplication } from "../application/interfaces/create-subscription.application.interface";
import { HttpMetricsInterceptor } from "../infrastructure/metrics/http-metrics.interceptor";
import { HttpExceptionFilter } from "../infrastructure/nestjs/filters/http-exception.filter";
import { TYPES } from "../ioc/types";

@UseInterceptors(HttpMetricsInterceptor)
@UseFilters(new HttpExceptionFilter())
@Controller("subscribe")
export class SubscriptionController {
  constructor(
    @Inject(TYPES.applications.CreateSubscriptionApplication)
    private readonly createSubscriptionApp: CreateSubscriptionApplication,
    @Inject(TYPES.applications.RemoveSubscriptionApplication)
    private readonly removeSubscriptionApp: RemoveSubscriptionApplication,
  ) {}

  @Post()
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    await this.createSubscriptionApp.execute(createSubscriptionDto.email);
  }

  @Delete(":email")
  async unsubscribe(@Param("email") email: string) {
    await this.removeSubscriptionApp.execute(email);
  }
}
