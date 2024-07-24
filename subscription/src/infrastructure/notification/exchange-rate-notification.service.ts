import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

import { NotificationService } from "./interfaces/notification.service.interface";
import { TYPES } from "../../ioc";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";

@Injectable()
export class ExchangeRateNotificationService implements NotificationService {
  private exchangeRateUrl: string;

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.exchangeRateUrl =
      this.appConfigService.microservicesApi.exchangeRateUrl;
  }

  async sendNotify(subscribers: string[]): Promise<void> {
    if (!subscribers.length) return;

    await firstValueFrom(
      this.httpService.post<void>(`${this.exchangeRateUrl}/rate/send-emails`, {
        emails: subscribers,
      }),
    );
  }
}
