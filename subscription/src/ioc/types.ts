export const TYPES = {
  applications: {
    CreateSubscriptionApplication: Symbol("CreateSubscriptionApplication"),
    TriggerSendExchangeRateNotificationApplication: Symbol(
      "TriggerSendExchangeRateNotificationApplication",
    ),
  },
  services: {
    SubscriptionService: Symbol("SubscriptionService"),
  },
  repositories: {
    SubscriptionRepository: Symbol("SubscriptionRepository"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    NotificationService: Symbol("NotificationService"),
    ExchangeRateCronService: Symbol("ExchangeRateCronService"),
  },
};
