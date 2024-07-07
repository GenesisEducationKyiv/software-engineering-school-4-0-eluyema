import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { MailerService } from "./interfaces/mailer.service.interface";
import { Email } from "../../domain/entities/email.entity";

@Injectable()
export class KafkaMailerServiceImpl implements MailerService {
  constructor(
    @Inject("mailer-microservice")
    protected readonly serverClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.serverClient.connect();
  }

  async sendEmail(email: Email) {
    await this.serverClient.emit("send-emails", JSON.stringify(email));
  }
}
