import { SchedulerRegistry } from "@nestjs/schedule";

import { NotifyCurrentExchangeRateApplication } from "src/application/interfaces/notify-current-exchange-rate.application.interface";
import { TestAppConfigServiceImpl } from "src/test-utils/config/test-app-config.service";

import { CurrentRateCronServiceImpl } from "./current-rate-cron.service";

jest.mock("@nestjs/schedule", () => ({
  SchedulerRegistry: function () {
    this.addCronJob = jest.fn();
  },
}));

jest.mock("cron", () => ({
  CronJob: function (_pattern, callback) {
    this.start = jest.fn().mockImplementation(() => {
      callback();
    });
  },
}));

describe("CurrentRateCronServiceImpl", () => {
  let service: CurrentRateCronServiceImpl;
  let schedulerRegistry: SchedulerRegistry;
  let notifyRateSubscribersApplication: NotifyCurrentExchangeRateApplication;
  let appConfigService: TestAppConfigServiceImpl;

  class TestNotifyRateSubscribersApplication
    implements NotifyCurrentExchangeRateApplication
  {
    execute = jest.fn();
  }

  beforeEach(async () => {
    schedulerRegistry = new SchedulerRegistry();
    notifyRateSubscribersApplication =
      new TestNotifyRateSubscribersApplication();

    appConfigService = new TestAppConfigServiceImpl();
    service = new CurrentRateCronServiceImpl(
      schedulerRegistry,
      notifyRateSubscribersApplication,
      appConfigService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send exchange rate throw configured time", () => {
    service.onModuleInit();
    expect(notifyRateSubscribersApplication.execute).toHaveBeenCalledTimes(1);
  });
});
