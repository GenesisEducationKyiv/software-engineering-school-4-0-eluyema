import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateSubscriptionApplication } from '../interfaces/applications/create-subscription.application.interface';
import { TYPES } from '../interfaces/types';

@Controller('subscribe')
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
    const isSubscribeSuccess = await this.createSubscriptionApp.execute(
      createSubscriptionDto.email,
    );

    if (!isSubscribeSuccess) {
      response.status(409).send();
      return;
    }
    return response.status(200).send();
  }
}
