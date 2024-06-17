import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';

import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { ExchangeRateModule } from '../../exchange-rate.module';
import { TYPES } from '../../infrastructure/ioc';
import { FetchExchangeRateApplicationImpl } from '../fetch-exchange-rate.application';

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

describe('FetchExchangeRateApplicationImpl integration', () => {
  let application: FetchExchangeRateApplicationImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, ScheduleModule.forRoot(), ExchangeRateModule],
    }).compile();

    application = module.get<FetchExchangeRateApplicationImpl>(
      fetchExchangeRateApp.provide,
    );
  });

  it('class should exist', () => {
    expect(application).toBeDefined();
  });

  it('should return exchange rate', async () => {
    const currentTime = new Date();
    const exchangeRate = await application.execute();
    expect(exchangeRate).toBeInstanceOf(ExchangeRate);
    expect(exchangeRate.rate).toBeGreaterThan(0);
    expect(exchangeRate.date.getTime()).toBeGreaterThanOrEqual(
      currentTime.getTime(),
    );
    expect(exchangeRate.base).toEqual('USD');
  });
});
