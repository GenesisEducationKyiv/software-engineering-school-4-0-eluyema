import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { AppConfigService } from "src/infrastructure/config/interfaces/app-config.service.interface";
import { TYPES } from "src/ioc";

import { Email } from "../../../domain/entities/email.entity";
import { MailerService } from "../../notification/interfaces/mailer.service.interface";

@Injectable()
export class MailerServiceImpl implements MailerService {
  private mailerUrl: string;

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.mailerUrl = this.appConfigService.microservicesApi.mailerUrl;
  }

  async sendEmail(email: Email) {
    await firstValueFrom(
      this.httpService.post<void>(
        `${this.mailerUrl}/mailer/send-emails`,
        email,
      ),
    );
  }
}
