import { ExchangeRateNotificationService } from "./interfaces/exchange-rate-notification.service.interface";
import { SendExchangeRateToSubscribersApplicationImpl } from "./send-exchange-rate-to-subscribers.application";
import { ExchangeRate } from "../domain/entities/exchange-rate.entity";
import { ExchangeRateService } from "../domain/services/interfaces/exchange-rate.service.interface";

describe("SendExchangeRateToSubscribersApplicationImpl", () => {
  let application: SendExchangeRateToSubscribersApplicationImpl;
  let exchangeRateService: ExchangeRateService;
  let exchangeRateNotificationService: ExchangeRateNotificationService;

  class TestExchangeRateService implements ExchangeRateService {
    getCurrentExchangeRate = jest.fn();
    fetchExchangeRates = jest.fn();
    setNext = jest.fn();
  }

  class TestExchangeRateNotificationService
    implements ExchangeRateNotificationService
  {
    sendExchangeRateNotification = jest.fn();
  }

  beforeEach(async () => {
    exchangeRateService = new TestExchangeRateService();
    exchangeRateNotificationService = new TestExchangeRateNotificationService();
    application = new SendExchangeRateToSubscribersApplicationImpl(
      exchangeRateService,
      exchangeRateNotificationService,
    );
  });

  it("should be defined", () => {
    expect(application).toBeDefined();
  });

  it("should send email after fetch subscribers", async () => {
    const expectedExchangeRate = new ExchangeRate("USD", 28, new Date());
    const subscribers = ["email2@gmail.com", "email1@gmail.com"];
    jest
      .spyOn(exchangeRateService, "getCurrentExchangeRate")
      .mockResolvedValue(expectedExchangeRate);

    await application.execute(subscribers);

    expect(
      exchangeRateNotificationService.sendExchangeRateNotification,
    ).toHaveBeenCalledWith(expectedExchangeRate, subscribers);
  });

  it("should not send email if subscriber list is empty", async () => {
    const expectedExchangeRate = new ExchangeRate("USD", 28, new Date());
    const subscribers = [];
    jest
      .spyOn(exchangeRateService, "getCurrentExchangeRate")
      .mockResolvedValue(expectedExchangeRate);

    await application.execute(subscribers);

    expect(
      exchangeRateNotificationService.sendExchangeRateNotification,
    ).toHaveBeenCalledTimes(0);
  });

  it("should throw error if exchangeRateService throw an error", async () => {
    const subscribers = ["email2@gmail.com", "email1@gmail.com"];
    jest
      .spyOn(exchangeRateService, "getCurrentExchangeRate")
      .mockRejectedValue(new Error("ExchangeRateService failed"));

    expect(async () => await application.execute(subscribers)).rejects.toThrow(
      "ExchangeRateService failed",
    );
  });
});
