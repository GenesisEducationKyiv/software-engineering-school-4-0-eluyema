export const TYPES = {
  applications: {
    FetchExchangeRateApplication: Symbol('FetchExchangeRateApplication'),
  },
  services: {
    ExchangeRateService: Symbol('ExchangeRateService'),
  },
  clients: {
    ExchangeRateClient: Symbol('ExchangeRateClient'),
  },
  notification: {
    ExchangeRateNotificationService: Symbol('ExchangeRateNotificationService'),
  },
  cron: {
    ExchangeRateCronService: Symbol('ExchangeRateCronService'),
  },
};
