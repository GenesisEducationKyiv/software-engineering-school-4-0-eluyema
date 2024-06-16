import { SubscriptionService } from 'src/modules/subscription/domain/services/interfaces/subscription.service.interface';

import { SendExchangeRateToSubscribersApplicationImpl } from './send-exchange-rate-to-subscribers.application';
import { ExchangeRate } from '../domain/entities/exchange-rate.entity';
import { ExchangeRateService } from '../domain/services/interfaces/exchange-rate.service.interface';
import { ExchangeRateNotificationService } from '../infrastructure/notification/interfaces/exchange-rate-notification.service.interface';

describe('SendExchangeRateToSubscribersApplicationImpl', () => {
  let application: SendExchangeRateToSubscribersApplicationImpl;
  let exchangeRateService: ExchangeRateService;
  let subscriptionService: SubscriptionService;
  let exchangeRateNotificationService: ExchangeRateNotificationService;

  class TestExchangeRateService implements ExchangeRateService {
    getCurrentExchangeRate = jest.fn();
  }

  class TestSubscriptionService implements SubscriptionService {
    create = jest.fn();
    getSubscribers = jest.fn();
  }

  class TestExchangeRateNotificationService
    implements ExchangeRateNotificationService
  {
    sendExchangeRateNotification = jest.fn();
  }

  beforeEach(async () => {
    exchangeRateService = new TestExchangeRateService();
    subscriptionService = new TestSubscriptionService();
    exchangeRateNotificationService = new TestExchangeRateNotificationService();
    application = new SendExchangeRateToSubscribersApplicationImpl(
      exchangeRateService,
      subscriptionService,
      exchangeRateNotificationService,
    );
  });

  it('should be defined', () => {
    expect(application).toBeDefined();
  });

  it('should send email after fetch subscribers', async () => {
    const expectedExchangeRate = new ExchangeRate('USD', 28, new Date());
    const subscribers = ['email2@gmail.com', 'email1@gmail.com'];
    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockResolvedValue(expectedExchangeRate);
    jest
      .spyOn(subscriptionService, 'getSubscribers')
      .mockResolvedValue(subscribers);

    await application.execute();

    expect(
      exchangeRateNotificationService.sendExchangeRateNotification,
    ).toHaveBeenCalledWith(expectedExchangeRate, subscribers);
  });

  it('should not send email if subscriber list is empty', async () => {
    const expectedExchangeRate = new ExchangeRate('USD', 28, new Date());
    const subscribers = [];
    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockResolvedValue(expectedExchangeRate);
    jest
      .spyOn(subscriptionService, 'getSubscribers')
      .mockResolvedValue(subscribers);

    await application.execute();

    expect(
      exchangeRateNotificationService.sendExchangeRateNotification,
    ).toHaveBeenCalledTimes(0);
  });

  it('should throw error if exchangeRateService throw an error', async () => {
    const subscribers = ['email2@gmail.com', 'email1@gmail.com'];
    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockRejectedValue(new Error('ExchangeRateService failed'));
    jest
      .spyOn(subscriptionService, 'getSubscribers')
      .mockResolvedValue(subscribers);

    expect(async () => await application.execute()).rejects.toThrow(
      'ExchangeRateService failed',
    );
  });

  it('should throw error if exchangeRateService throw an error', async () => {
    const expectedExchangeRate = new ExchangeRate('USD', 28, new Date());

    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockResolvedValue(expectedExchangeRate);
    jest
      .spyOn(subscriptionService, 'getSubscribers')
      .mockRejectedValue(new Error('SubscriptionService failed'));

    expect(async () => await application.execute()).rejects.toThrow(
      'SubscriptionService failed',
    );
  });
});
