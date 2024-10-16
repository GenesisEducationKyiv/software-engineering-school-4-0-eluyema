import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { NodemailerServiceImpl } from "src/infrastructure/email/nodemailer.service";
import { TYPES } from "src/ioc/types";

import { AddRateSubscriptionApplicationImpl } from "./application/add-rate-subscription.application";
import { NotifyRateSubscribersApplicationImpl } from "./application/notify-rate-subscribers.application";
import { RemoveRateSubscriptionApplicationImpl } from "./application/remove-rate-subscription.application";
import { UpdateExchangeRateApplicationImpl } from "./application/update-exchange-rate.application";
import { MetricsController } from "./controllers/metrics.controller";
import { RateController } from "./controllers/rate.controller";
import { SubscriptionController } from "./controllers/subscription.controller";
import { RateServiceImpl } from "./domain/services/rate.service";
import { SubscriptionServiceImpl } from "./domain/services/subscription.service";
import { ExchangeRateEmailComposerServiceImpl } from "./infrastructure/composers/exchange-rate-email-composer.service";
import { AppConfigModule } from "./infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "./infrastructure/config/app-config.service";
import { ExchangeRateNotificationServiceImpl } from "./infrastructure/email/exchange-rate-notification.service";
import { PrometheusMetricsServiceImpl } from "./infrastructure/metrics/metrics.service";
import { PrismaService } from "./infrastructure/prisma/prisma.service";
import { PrismaRateRepositoryImpl } from "./infrastructure/repositories/prisma-rate.repository";
import { PrismaSubscriptionRepositoryImpl } from "./infrastructure/repositories/prisma-subscription.repository";
import { NotifyRateSubscribtionCronServiceImpl } from "./infrastructure/scheduling/notify-rate-subscription-cron.service";
import { HandlebarsTemplateServiceImpl } from "./infrastructure/template/template.service";

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

const exchangeRateNotificationService = {
  provide: TYPES.services.ExchangeRateNotificationService,
  useClass: ExchangeRateNotificationServiceImpl,
};

const templateService = {
  provide: TYPES.infrastructure.TemplateService,
  useClass: HandlebarsTemplateServiceImpl,
};

const rateRepository = {
  provide: TYPES.repositories.RateRepository,
  useClass: PrismaRateRepositoryImpl,
};

const subscriptionRepository = {
  provide: TYPES.repositories.SubscriptionRepository,
  useClass: PrismaSubscriptionRepositoryImpl,
};

const metricsService = {
  provide: TYPES.infrastructure.MetricsService,
  useClass: PrometheusMetricsServiceImpl,
};

@Module({
  imports: [AppConfigModule, ScheduleModule.forRoot()],
  controllers: [SubscriptionController, RateController, MetricsController],
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
    templateService,
    rateRepository,
    subscriptionRepository,
    exchangeRateNotificationService,
    metricsService,
    PrismaService,
  ],
})
export class AppModule {}
