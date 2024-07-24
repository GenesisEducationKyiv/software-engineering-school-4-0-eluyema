import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { SubscriptionService } from "./interfaces/subscription.service.interface";
import { TYPES } from "../../ioc";
import { AppConfigService } from "../config/interfaces/app-config.service.interface";

@Injectable()
export class SubscriptionServiceImpl implements SubscriptionService {
  private subscriptionUrl: string;

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {
    this.subscriptionUrl =
      this.appConfigService.microservicesApi.subscriptionUrl;
  }

  async subscribe(email: string) {
    try {
      const params = new URLSearchParams();
      params.append("email", email);

      const response = await firstValueFrom(
        this.httpService.post<void>(
          `${this.subscriptionUrl}/subscribe`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw new HttpException("", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const httpCode = error.response ? error.response.status : 500;

      if (httpCode === 409) {
        throw new HttpException("", HttpStatus.CONFLICT);
      }

      if (httpCode === 400) {
        throw new HttpException("", HttpStatus.BAD_REQUEST);
      }

      throw new HttpException("", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unsubscribe(email: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<void>(
          `${this.subscriptionUrl}/subscribe/` + email,
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException("", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
