export const TYPES = {
  applications: {
    CreateSubscriptionApplication: Symbol("CreateSubscriptionApplication"),
    RemoveSubscriptionApplication: Symbol("RemoveSubscriptionApplication"),
  },
  services: {
    SubscriptionService: Symbol("SubscriptionService"),
  },
  repositories: {
    SubscriptionRepository: Symbol("SubscriptionRepository"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    EventNotificationService: Symbol("EventNotificationService"),
  },
  brokers: {
    ExchangeRate: "ExchangeRateBrokerClient",
    Mailer: "MailerBrokerClient",
  },
};
