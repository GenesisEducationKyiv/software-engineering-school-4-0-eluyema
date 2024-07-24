import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { TYPES } from "src/ioc";

import { EventFactory } from "./event.factory";
import { MailerService } from "./interfaces/mailer.service.interface";
import { Email } from "../../domain/entities/email.entity";

@Injectable()
export class KafkaMailerServiceImpl implements MailerService {
  constructor(
    @Inject(TYPES.brokers.Mailer)
    protected readonly serverClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.serverClient.connect();
  }

  async sendEmail(email: Email) {
    await this.serverClient.emit(
      "send-emails",
      JSON.stringify(EventFactory.createEvent("send-emails", email)),
    );
  }
}
