import { HttpService } from "@nestjs/axios";
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { of } from "rxjs";

import { OpenexchangeratesClientImpl } from "./openexchangerates.client";
import { ExchangeRate } from "../../../domain/entities/exchange-rate.entity";
import { TestAppConfigServiceImpl } from "../../../test-utils/config/test-app-config.service";

jest.mock("@nestjs/axios", () => ({
  HttpService: function () {
    this.get = jest.fn();
  },
}));

describe("OpenexchangeratesClientImpl", () => {
  let client: OpenexchangeratesClientImpl;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = new HttpService();
    client = new OpenexchangeratesClientImpl(
      httpService,
      new TestAppConfigServiceImpl(),
    );
  });

  it("should be defined", () => {
    expect(client).toBeDefined();
  });

  it("should fetch exchange rates", async () => {
    const result: ExchangeRate = {
      date: new Date(1627840847),
      base: "USD",
      rate: 28,
    };

    const axiosResponse: AxiosResponse<ExchangeRate> = {
      data: result,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: {} as AxiosRequestHeaders },
    };

    jest.spyOn(httpService, "get").mockReturnValue(of(axiosResponse));
    const data = await client.getCurrentExchangeRate();
    expect(data).toEqual(result);
  });

  it("should throw an error when request failed", () => {
    jest.spyOn(httpService, "get").mockImplementation(() => {
      throw new AxiosError("Request failed", "500");
    });

    client
      .getCurrentExchangeRate()
      .then((data) => {
        expect(data).toBeUndefined();
      })
      .catch((err) => {
        expect(err.message).toEqual("Request to get currency rate failed");
      });
  });
});
