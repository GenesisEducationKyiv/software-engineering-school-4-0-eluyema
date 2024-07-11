export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol("FetchExchangeRateApplication"),
    CreateSubscriptionApplication: Symbol("CreateSubscriptionApplication"),
    RemoveSubscriptionApplication: Symbol("RemoveSubscriptionApplication"),
  },
  infrastructure: {
    AppConfigService: Symbol("AppConfigService"),
    ExchangeRateService: Symbol("ExchangeRateService"),
    SubscriptionService: Symbol("SubscriptionService"),
  },
};
