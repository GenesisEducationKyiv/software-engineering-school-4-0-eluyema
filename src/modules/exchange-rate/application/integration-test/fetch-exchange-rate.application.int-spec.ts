import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc/types';

import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { ExchangeRateServiceImpl } from '../../domain/services/exchange-rate.service';
import { ExchangeRateClientImpl } from '../../infrastructure/http/clients/exchange-rate.client';
import { TYPES } from '../../infrastructure/ioc';
import { FetchExchangeRateApplicationImpl } from '../fetch-exchange-rate.application';

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const exchangeRateClient = {
  provide: TYPES.infrastructure.ExchangeRateClient,
  useClass: ExchangeRateClientImpl,
};

const appConfigService = {
  provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

describe('FetchExchangeRateApplicationImpl integration', () => {
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
