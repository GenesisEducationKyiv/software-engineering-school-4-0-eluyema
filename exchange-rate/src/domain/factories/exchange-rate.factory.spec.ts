import { ExchangeRateFactory } from "./exchange-rate.factory";
import { ExchangeRate } from "../entities/exchange-rate.entity";

describe("ExchangeRateFactory", () => {
  it("Create exchange rate", () => {
    const data = {
      base: "USD",
      rate: 28,
      date: new Date(),
    };
    const exchangeRate = ExchangeRateFactory.create(
      data.base,
      data.rate,
      data.date,
    );

    expect(exchangeRate.base).toEqual(data.base);
    expect(exchangeRate.rate).toEqual(data.rate);
    expect(exchangeRate.date).toEqual(data.date);
    expect(exchangeRate).toBeInstanceOf(ExchangeRate);
  });
});
