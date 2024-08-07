import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { ExchangeRateServiceImpl } from "../../domain/services/exchange-rate.service";
import { ExchangeRateClient } from "../../domain/services/interfaces/exchange-rate.client.interface";
import { ExchangeRateEmailComposerServiceImpl } from "../../infrastructure/composers/exchange-rate-email-composer.service";
import { AppConfigServiceImpl } from "../../infrastructure/config/app-config.service";
import { AppConfigService } from "../../infrastructure/config/interfaces/app-config.service.interface";
import { BankgovClientImpl } from "../../infrastructure/http/clients/bankgov.client";
import { LoggingExchangeRateServiceDecorator } from "../../infrastructure/http/clients/logging-exchange-rate.decorator";
import { OpenexchangeratesClientImpl } from "../../infrastructure/http/clients/openexchangerates.client";
import { PrivatbankClientImpl } from "../../infrastructure/http/clients/privatbank.client";
import { ExchangeRateNotificationServiceImpl } from "../../infrastructure/notification/exchange-rate-email.service";
import { TYPES } from "../../ioc";
import { FetchExchangeRateApplicationImpl } from "../fetch-exchange-rate.application";
import { SendExchangeRateToSubscribersApplicationImpl } from "../send-exchange-rate-to-subscribers.application";

const fetchExchangeRateApp = {
  provide: TYPES.applications.FetchExchangeRateApplication,
  useClass: FetchExchangeRateApplicationImpl,
};

const exchangeRateService = {
  provide: TYPES.services.ExchangeRateService,
  useClass: ExchangeRateServiceImpl,
};

const appConfigService = {
  provide: TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
};

const exchangeRateClient = {
  provide: TYPES.infrastructure.ExchangeRateClients,
  useFactory: (
    appConfigService: AppConfigService,
    httpService: HttpService,
  ) => {
    const clientsMap = new Map<string, ExchangeRateClient>();

    clientsMap.set(
      "bank.gov.ua",
      new BankgovClientImpl(httpService, appConfigService),
    );
    clientsMap.set(
      "openexchangerates.org",
      new OpenexchangeratesClientImpl(httpService, appConfigService),
    );
    clientsMap.set(
      "api.privatbank.ua",
      new PrivatbankClientImpl(httpService, appConfigService),
    );

    return [...clientsMap].map(
      ([name, instance]) =>
        new LoggingExchangeRateServiceDecorator(instance, name),
    );
  },
  inject: [appConfigService.provide, HttpService],
};

const exchangeRateNotificationService = {
  provide: TYPES.infrastructure.ExchangeRateNotificationService,
  useClass: ExchangeRateNotificationServiceImpl,
};

const sendExchangeRateToSubscribersApp = {
  provide: TYPES.applications.SendExchangeRateToSubscribersApplication,
  useClass: SendExchangeRateToSubscribersApplicationImpl,
};

const emailComposerService = {
  provide: TYPES.infrastructure.ExchangeRateEmailComposerService,
  useClass: ExchangeRateEmailComposerServiceImpl,
};

jest.mock("nodemailer");

describe("SendExchangeRateToSubscribersApplicationImpl integration", () => {
  let application: SendExchangeRateToSubscribersApplicationImpl;
  let transporterMock: Partial<jest.Mocked<nodemailer.Transporter>>;
  let prisma: PrismaService;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({}),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        ConfigModule,
        SubscriptionModule,
        MailerModule,
        HttpModule,
      ],
      providers: [
        sendExchangeRateToSubscribersApp,
        fetchExchangeRateApp,
        exchangeRateClient,
        exchangeRateService,
        exchangeRateNotificationService,
        appConfigService,
        emailComposerService,
      ],
    }).compile();

    application = module.get<SendExchangeRateToSubscribersApplicationImpl>(
      TYPES.applications.SendExchangeRateToSubscribersApplication,
    );
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.subscription.deleteMany();
  });

  it("class should exist", () => {
    expect(application).toBeDefined();
  });

  it("should not send email if subscribers list is empty", async () => {
    await application.execute();
    expect(transporterMock.sendMail).toHaveBeenCalledTimes(0);
  });

  it("should email if subscribers list is not empty", async () => {
    const email = "goodemail@gmail.com";
    await prisma.subscription.create({ data: { email } });

    await application.execute();

    expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Exchange Rate Service" <no-reply@exchangerateservice.com>',
      subject: "Daily Exchange Rate",
      to: email,
      html: expect.anything(),
    });
  });
});
