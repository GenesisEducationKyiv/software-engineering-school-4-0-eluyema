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

import { CreateSubscriptionSagaOrchestratorApplication } from "src/application/interfaces/create-subscription-saga-orchestrator.application.interface";
import { RemoveSubscriptionSagaOrchestratorApplication } from "src/application/interfaces/remove-subscription-saga-orchestrator.application.interface";

import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { TYPES } from "../ioc/types";

@Controller("subscribe")
export class SubscriptionController {
  constructor(
    @Inject(TYPES.applications.CreateSubscriptionSagaOrchestratorApplication)
    private readonly createSubscriptionApp: CreateSubscriptionSagaOrchestratorApplication,
    @Inject(TYPES.applications.RemoveSubscriptionSagaOrchestratorApplication)
    private readonly removeSubscriptionApplication: RemoveSubscriptionSagaOrchestratorApplication,
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
