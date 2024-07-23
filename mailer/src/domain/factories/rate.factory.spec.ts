import { RateFactory } from "./rate.factory";
import { Rate } from "../entities/rate.entity";

describe("RateFactory", () => {
  it("Create exchange rate", () => {
    const data = {
      name: "UAH",
      rate: 28,
      date: new Date(),
    };
    const rate = RateFactory.create(data);

    expect(rate.name).toEqual(data.name);
    expect(rate.rate).toEqual(data.rate);
    expect(rate.date).toEqual(data.date);
    expect(rate).toBeInstanceOf(Rate);
  });
});
