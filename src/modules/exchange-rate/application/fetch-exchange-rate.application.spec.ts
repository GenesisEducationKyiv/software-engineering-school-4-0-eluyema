import { FetchExchangeRateApplicationImpl } from './fetch-exchange-rate.application';
import { ExchangeRate } from '../domain/entities/exchange-rate.entity';
import { ExchangeRateService } from '../domain/services/interfaces/exchange-rate.service.interface';

describe('FetchExchangeRateApplicationImpl', () => {
  let application: FetchExchangeRateApplicationImpl;
  let exchangeRateService: ExchangeRateService;

  class TestExchangeRateService implements ExchangeRateService {
    getCurrentExchangeRate = jest.fn();
  }

  beforeEach(async () => {
    exchangeRateService = new TestExchangeRateService();
    application = new FetchExchangeRateApplicationImpl(exchangeRateService);
  });

  it('should be defined', () => {
    expect(application).toBeDefined();
  });

  it('should return exchange rate', async () => {
    const expectedExchangeRate = new ExchangeRate('USD', 28, new Date());
    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockResolvedValue(expectedExchangeRate);

    const exchangeRate = await application.execute();

    expect(exchangeRate).toEqual(expectedExchangeRate);
  });

  it('should throw an error when exchangeRateService failed', async () => {
    jest
      .spyOn(exchangeRateService, 'getCurrentExchangeRate')
      .mockRejectedValue(new Error('ExchangeRateService Error'));

    application
      .execute()
      .then((email) => expect(email).toBeUndefined())
      .catch((err) => expect(err).toBeDefined());
  });
});
