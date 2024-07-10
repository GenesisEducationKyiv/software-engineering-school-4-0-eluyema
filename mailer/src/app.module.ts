import { Module } from "@nestjs/common";

import { NodemailerServiceImpl } from "src/infrastructure/email/nodemailer.service";
import { TYPES } from "src/ioc/types";

import { AddRateSubscriptionApplicationImpl } from "./application/add-rate-subscription.application";
import { NotifyRateSubscribersApplicationImpl } from "./application/notify-rate-subscribers.application";
import { RemoveRateSubscriptionApplicationImpl } from "./application/remove-rate-subscription.application";
import { UpdateExchangeRateApplicationImpl } from "./application/update-exchange-rate.application";
import { RateController } from "./controllers/rate.controller";
import { SubscriptionController } from "./controllers/subscription.controller";
import { RateServiceImpl } from "./domain/services/rate.service";
import { SubscriptionServiceImpl } from "./domain/services/subscription.service";
import { ExchangeRateEmailComposerServiceImpl } from "./infrastructure/composers/exchange-rate-email-composer.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { NotifyRateSubscribtionCronServiceImpl } from "./infrastructure/scheduling/notify-rate-subscription-cron.service";

const updateExchangeRateApplication = {
  provide: TYPES.applications.UpdateExchangeRateApplication,
  useClass: UpdateExchangeRateApplicationImpl,
};

const notifyRateSubscribersApplication = {
  provide: TYPES.applications.NotifyRateSubscribersApplication,
  useClass: NotifyRateSubscribersApplicationImpl,
};

const addRateSubscriptionApplication = {
  provide: TYPES.applications.AddRateSubscriptionApplication,
  useClass: AddRateSubscriptionApplicationImpl,
};

const removeRateSubscriptionApplication = {
  provide: TYPES.applications.RemoveRateSubscriptionApplication,
  useClass: RemoveRateSubscriptionApplicationImpl,
};

const notifyRateSubscribtionCronService = {
  provide: TYPES.infrastructure.NotifyRateSubscribtionCronService,
  useClass: NotifyRateSubscribtionCronServiceImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const emailService = {
  provide: TYPES.infrastructure.MailerService,
  useClass: NodemailerServiceImpl,
};

const rateService = {
  provide: TYPES.services.RateService,
  useClass: RateServiceImpl,
};

const subscriptionService = {
  provide: TYPES.services.SubscriptionService,
  useClass: SubscriptionServiceImpl,
};

const exchangeRateEmailComposerService = {
  provide: TYPES.infrastructure.ExchangeRateEmailComposerService,
  useClass: ExchangeRateEmailComposerServiceImpl,
};

@Module({
  imports: [AppConfigModule],
  controllers: [SubscriptionController, RateController],
  providers: [
    appConfigService,
    updateExchangeRateApplication,
    emailService,
    exchangeRateEmailComposerService,
    notifyRateSubscribersApplication,
    updateExchangeRateApplication,
    addRateSubscriptionApplication,
    removeRateSubscriptionApplication,
    notifyRateSubscribtionCronService,
    rateService,
    subscriptionService,
  ],
})
export class AppModule {}
