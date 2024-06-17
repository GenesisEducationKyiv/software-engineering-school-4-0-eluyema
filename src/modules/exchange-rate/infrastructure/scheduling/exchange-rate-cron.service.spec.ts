import { SchedulerRegistry } from '@nestjs/schedule';

import { TestAppConfigServiceImpl } from 'src/test-utils/config/test-app-config.service';

import { ExchangeRateCronServiceImpl } from './exchange-rate-cron.service';
import { SendExchangeRateToSubscribersApplication } from '../../application/interfaces/send-exchange-rate-to-subscribers.application.interface';

jest.mock('@nestjs/schedule', () => ({
  SchedulerRegistry: function () {
    this.addCronJob = jest.fn();
  },
}));

jest.mock('cron', () => ({
  CronJob: function (_pattern, callback) {
    this.start = jest.fn().mockImplementation(() => {
      callback();
    });
  },
}));

describe('ExchangeRateCronServiceImpl', () => {
  let service: ExchangeRateCronServiceImpl;
  let schedulerRegistry: SchedulerRegistry;
  let sendExchangeRateToSubscribersApplication: SendExchangeRateToSubscribersApplication;
  let appConfigService: TestAppConfigServiceImpl;

  class TestSendExchangeRateToSubscribersApplication
    implements SendExchangeRateToSubscribersApplication
  {
    execute = jest.fn();
  }

  beforeEach(async () => {
    schedulerRegistry = new SchedulerRegistry();
    sendExchangeRateToSubscribersApplication =
      new TestSendExchangeRateToSubscribersApplication();

    appConfigService = new TestAppConfigServiceImpl();
    service = new ExchangeRateCronServiceImpl(
      schedulerRegistry,
      sendExchangeRateToSubscribersApplication,
      appConfigService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send exchange rate throw configured time', () => {
    service.onModuleInit();
    expect(
      sendExchangeRateToSubscribersApplication.execute,
    ).toHaveBeenCalledTimes(1);
  });
});
