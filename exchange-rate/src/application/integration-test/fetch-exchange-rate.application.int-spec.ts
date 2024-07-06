import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { ExchangeRate } from "../../domain/entities/exchange-rate.entity";
import { AppConfigModule } from "../../infrastructure/config/app-config.module";
import { AppConfigServiceImpl } from "../../infrastructure/config/app-config.service";
import { BankgovClientImpl } from "../../infrastructure/http/clients/bankgov.client";
import { OpenexchangeratesClientImpl } from "../../infrastructure/http/clients/openexchangerates.client";
import { TYPES } from "../../ioc";
import { FetchExchangeRateApplicationImpl } from "../fetch-exchange-rate.application";

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: BankgovClientImpl,
};

const exchangeRateClient = {
  provide: TYPES.infrastructure.BankgovClient,
  useClass: OpenexchangeratesClientImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

describe("FetchExchangeRateApplicationImpl integration", () => {
  let application: FetchExchangeRateApplicationImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, ConfigModule, HttpModule],
      providers: [
        fetchExchangeRateApp,
        exchangeRateClient,
        exchangeRateService,
        appConfigService,
      ],
    }).compile();

    application = module.get<FetchExchangeRateApplicationImpl>(
      TYPES.applications.FetchExchangeRateApplication,
    );
  });

  it("class should exist", () => {
    expect(application).toBeDefined();
  });

  it("should return exchange rate", async () => {
    const currentTime = new Date();
    const exchangeRate = await application.execute();
    expect(exchangeRate).toBeInstanceOf(ExchangeRate);
    expect(exchangeRate.rate).toBeGreaterThan(0);
    expect(exchangeRate.date.getTime()).toBeGreaterThanOrEqual(
      currentTime.getTime(),
    );
    expect(exchangeRate.base).toEqual("USD");
  });
});
