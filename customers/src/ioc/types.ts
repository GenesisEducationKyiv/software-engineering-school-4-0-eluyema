export const TYPES = {
  applications: {
    CreateCustomerApplication: Symbol("CreateCustomerApplication"),
    RemoveCustomerApplication: Symbol("RemoveCustomerApplication"),
  },
  services: {
    CustomerService: Symbol("CustomerService"),
  },
  repositories: {
    CustomerRepository: Symbol("CustomerRepository"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    EventNotificationService: Symbol("EventNotificationService"),
    MetricsService: Symbol("MetricsService"),
  },
  brokers: {
    ExchangeRate: "ExchangeRateBrokerClient",
    Mailer: "MailerBrokerClient",
    Subscription: "SubscriptionBrokerClient",
  },
};
