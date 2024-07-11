import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { CreateSubscriptionApplicationImpl } from "./application/create-subscription.application";
import { FetchExchangeRateApplicationImpl } from "./application/fetch-exchange-rate.application";
import { RemoveSubscriptionApplicationImpl } from "./application/remove-subscription.application";
import { ExchangeRateController } from "./controllers/exchange-rate.controller";
import { SubscriptionController } from "./controllers/subscription.controller";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { ExchangeRateServiceImpl } from "./infrastructure/http/exchange-rate.service";
import { SubscriptionServiceImpl } from "./infrastructure/http/subscription.service";
import { TYPES } from "./ioc/types";

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const createSubscriptionApp = {
  provide: TYPES.applications.CreateSubscriptionApplication,
  useClass: CreateSubscriptionApplicationImpl,
};

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const removeSubscriptionApp = {
  provide: TYPES.applications.RemoveSubscriptionApplication,
  useClass: RemoveSubscriptionApplicationImpl,
};

const exchangeRateService = {
  provide: TYPES.infrastructure.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const subscriptionService = {
  provide: TYPES.infrastructure.SubscriptionService,
  useClass: SubscriptionServiceImpl,
};

@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [ExchangeRateController, SubscriptionController],
  providers: [
    appConfigService,
    createSubscriptionApp,
    fetchExchangeRateApp,
    removeSubscriptionApp,
    exchangeRateService,
    subscriptionService,
  ],
})
export class AppModule {}
