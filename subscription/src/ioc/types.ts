export const TYPES = {
  applications: {
    CreateSubscriptionSagaOrchestratorApplication: Symbol(
      "CreateSubscriptionSagaOrchestratorApplication",
    ),
    RemoveSubscriptionSagaOrchestratorApplication: Symbol(
      "RemoveSubscriptionSagaOrchestratorApplication",
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
    EventMailerNotificationService: Symbol("EventMailerNotificationService"),
    EventCustomersNotificationService: Symbol(
      "EventCustomersNotificationService",
    ),
  },
  brokers: {
    ExchangeRate: "ExchangeRateBrokerClient",
    Mailer: "MailerBrokerClient",
    Customers: "Customers",
  },
};
