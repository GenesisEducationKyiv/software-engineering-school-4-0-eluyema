import { SchedulerRegistry } from "@nestjs/schedule";

import { ExchangeRateCronServiceImpl } from "./exchange-rate-cron.service";
import { TriggerSendExchangeRateNotificationApplication } from "../../application/interfaces/trigger-send-exchange-rate-notification.application.interface";
import { TestAppConfigServiceImpl } from "../../test-utils/config/test-app-config.service";

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
  let triggerSendExchangeRateNotificationApplication: TriggerSendExchangeRateNotificationApplication;
  let appConfigService: TestAppConfigServiceImpl;

  class TestTriggerSendExchangeRateNotificationApplication
    implements TriggerSendExchangeRateNotificationApplication
  {
    execute = jest.fn();
  }

  beforeEach(async () => {
    schedulerRegistry = new SchedulerRegistry();
    triggerSendExchangeRateNotificationApplication =
      new TestTriggerSendExchangeRateNotificationApplication();

    appConfigService = new TestAppConfigServiceImpl();
    service = new ExchangeRateCronServiceImpl(
      schedulerRegistry,
      triggerSendExchangeRateNotificationApplication,
      appConfigService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send exchange rate throw configured time", () => {
    service.onModuleInit();
    expect(
      triggerSendExchangeRateNotificationApplication.execute,
    ).toHaveBeenCalledTimes(1);
  });
});
