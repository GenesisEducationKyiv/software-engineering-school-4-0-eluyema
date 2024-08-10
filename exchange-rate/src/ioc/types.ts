export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol("FetchExchangeRateApplication"),
    NotifyCurrentExchangeRateApplication: Symbol(
      "NotifyCurrentExchangeRateApplication",
    ),
  },
  services: {
    TemplateService: Symbol("TemplateService"),
    ExchangeRateService: Symbol("ExchangeRateService"),
    EmailService: Symbol("EmailService"),
  },
  infrastructure: {
    ExchangeRateClients: Symbol("ExchangeRateClients"),
    CurrentRateCronService: Symbol("CurrentRateCronService"),
    EventNotificationService: Symbol("EventNotificationService"),
    AppConfigService: Symbol("AppConfigService"),
  },
  brokers: {
    Mailer: "MailerBrokerClient",
  },
};
