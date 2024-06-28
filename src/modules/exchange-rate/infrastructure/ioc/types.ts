export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol('FetchExchangeRateApplication'),
    SendExchangeRateToSubscribersApplication: Symbol(
      'SendExchangeRateToSubscribersApplication',
    ),
  },
  services: {
    ExchangeRateService: Symbol('ExchangeRateService'),
  },
  infrastructure: {
    ExchangeRateClients: Symbol('ExchangeRateClients'),
    ExchangeRateNotificationService: Symbol('ExchangeRateNotificationService'),
    ExchangeRateCronService: Symbol('ExchangeRateCronService'),
    ExchangeRateEmailComposerService: Symbol(
      'ExchangeRateEmailComposerServiceImpl',
    ),
  },
};
