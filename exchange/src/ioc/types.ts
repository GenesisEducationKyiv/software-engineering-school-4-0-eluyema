export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol("FetchExchangeRateApplication"),
    SendExchangeRateToSubscribersApplication: Symbol(
      "SendExchangeRateToSubscribersApplication",
    ),
  },
  services: {
    TemplateService: Symbol("TemplateService"),
    ExchangeRateService: Symbol("ExchangeRateService"),
    EmailService: Symbol("EmailService"),
  },
  infrastructure: {
    ExchangeRateClients: Symbol("ExchangeRateClients"),
    ExchangeRateNotificationService: Symbol("ExchangeRateNotificationService"),
    ExchangeRateCronService: Symbol("ExchangeRateCronService"),
    ExchangeRateEmailComposerService: Symbol(
      "ExchangeRateEmailComposerServiceImpl",
    ),
    AppConfigService: Symbol("AppConfigService"),
  },
};
