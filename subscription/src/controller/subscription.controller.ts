import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { FastifyReply } from "fastify";

import { RemoveSubscriptionApplication } from "src/application/interfaces/remove-subscription.application.interface";

import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { CreateSubscriptionApplication } from "../application/interfaces/create-subscription.application.interface";
import { TYPES } from "../ioc/types";

@Controller("subscribe")
export class SubscriptionController {
  constructor(
    @Inject(TYPES.applications.CreateSubscriptionApplication)
    private readonly createSubscriptionApp: CreateSubscriptionApplication,
    @Inject(TYPES.applications.RemoveSubscriptionApplication)
    private readonly removeSubscriptionApplication: RemoveSubscriptionApplication,
  ) {}

  @Post()
  async subscribe(
    @Res() response: FastifyReply,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const isSubscribeSuccess = await this.createSubscriptionApp.execute(
      createSubscriptionDto.email,
    );

    if (!isSubscribeSuccess) {
      response.status(409).send();
      return;
    }
    return response.status(200).send();
  }

  @Delete(":email")
  @HttpCode(200)
  async unsubscribe(@Param("email") email: string) {
    await this.removeSubscriptionApplication.execute(email);
  }
}
