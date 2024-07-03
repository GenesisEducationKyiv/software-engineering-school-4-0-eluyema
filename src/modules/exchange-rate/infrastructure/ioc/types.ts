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
    ExchangeRateClient: Symbol('ExchangeRateClient'),
    ExchangeRateNotificationService: Symbol('ExchangeRateNotificationService'),
    ExchangeRateCronService: Symbol('ExchangeRateCronService'),
    ExchangeRateEmailComposerService: Symbol(
      'ExchangeRateEmailComposerServiceImpl',
    ),
  },
};
