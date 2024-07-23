export const TYPES = {
  applications: {
    AddRateSubscriptionApplication: Symbol("AddRateSubscriptionApplication"),
    NotifyRateSubscribersApplication: Symbol(
      "NotifyRateSubscribersApplication",
    ),
    RemoveRateSubscriptionApplication: Symbol(
      "RemoveRateSubscriptionApplication",
    ),
    UpdateExchangeRateApplication: Symbol("UpdateExchangeRateApplication"),
  },
  services: {
    SubscriptionService: Symbol("SubscriptionService"),
    RateService: Symbol("RateService"),
    ExchangeRateNotificationService: Symbol("ExchangeRateNotificationService"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    EventNotificationService: Symbol("EventNotificationService"),
    MailerService: Symbol("MailerService"),
    TemplateService: Symbol("TemplateService"),
    ExchangeRateEmailComposerService: Symbol(
      "ExchangeRateEmailComposerService",
    ),
    NotifyRateSubscribtionCronService: Symbol(
      "NotifyRateSubscribtionCronService",
    ),
  },
  repositories: {
    SubscriptionRepository: Symbol("SubscriptionRepository"),
    RateRepository: Symbol("RateRepository"),
  },
};
