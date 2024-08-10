import { SchedulerRegistry } from "@nestjs/schedule";

import { NotifyRateSubscribersApplication } from "src/application/interfaces/notify-rate-subscribers.application.interface";
import { TestAppConfigServiceImpl } from "src/test-utils/config/test-app-config.service";

import { ExchangeRateCronServiceImpl } from "./notify-rate-subscription-cron.service";

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

describe("ExchangeRateCronServiceImpl", () => {
  let service: ExchangeRateCronServiceImpl;
  let schedulerRegistry: SchedulerRegistry;
  let notifyRateSubscribersApplication: NotifyRateSubscribersApplication;
  let appConfigService: TestAppConfigServiceImpl;

  class TestNotifyRateSubscribersApplication
    implements NotifyRateSubscribersApplication
  {
    execute = jest.fn();
  }

  beforeEach(async () => {
    schedulerRegistry = new SchedulerRegistry();
    notifyRateSubscribersApplication =
      new TestNotifyRateSubscribersApplication();

    appConfigService = new TestAppConfigServiceImpl();
    service = new ExchangeRateCronServiceImpl(
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
