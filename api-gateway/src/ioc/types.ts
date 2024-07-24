export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol("FetchExchangeRateApplication"),
    CreateSubscriptionApplication: Symbol("CreateSubscriptionApplication"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    ExchangeRateService: Symbol("ExchangeRateService"),
    SubscriptionService: Symbol("SubscriptionService"),
  },
};
