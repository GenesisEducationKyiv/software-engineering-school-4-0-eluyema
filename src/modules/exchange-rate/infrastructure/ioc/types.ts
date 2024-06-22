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
    OpenexchangeratesClient: Symbol('OpenexchangeratesClient'),
    BankgovClient: Symbol('BankgovClient'),
    ExchangeRateNotificationService: Symbol('ExchangeRateNotificationService'),
    ExchangeRateCronService: Symbol('ExchangeRateCronService'),
    ExchangeRateEmailComposerService: Symbol(
      'ExchangeRateEmailComposerServiceImpl',
    ),
  },
};
