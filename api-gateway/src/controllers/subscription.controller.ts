import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  UseFilters,
} from "@nestjs/common";
import { FastifyReply } from "fastify";

import { CreateSubscriptionDto } from "./dtos/create-subscription.dto";
import { CreateSubscriptionApplication } from "../application/interfaces/create-subscription.application.interface";
import { HttpExceptionFilter } from "../infrastructure/nestjs/filters/http-exception.filter";
import { TYPES } from "../ioc/types";

@UseFilters(new HttpExceptionFilter())
@Controller("subscribe")
export class SubscriptionController {
  constructor(
    @Inject(TYPES.applications.CreateSubscriptionApplication)
    private readonly createSubscriptionApp: CreateSubscriptionApplication,
  ) {}

  @Post()
  async subscribe(
    @Res() response: FastifyReply,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    await this.createSubscriptionApp.execute(createSubscriptionDto.email);
  }
}
