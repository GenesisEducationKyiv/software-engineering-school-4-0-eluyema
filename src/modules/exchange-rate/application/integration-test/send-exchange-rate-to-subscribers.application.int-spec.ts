import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

import { ExchangeRateEmailComposerServiceImpl } from 'src/modules/mailer/infrastructure/email/composers/exchange-rate-email-composer.service';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { AppConfigModule } from 'src/shared/infrastructure/config/app-config.module';
import { AppConfigServiceImpl } from 'src/shared/infrastructure/config/app-config.service';
import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc/types';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

import { ExchangeRateServiceImpl } from '../../domain/services/chain-exchange-rate.service';
import { OpenexchangeratesClientImpl } from '../../infrastructure/http/clients/openexchangerates.client';
import { TYPES } from '../../infrastructure/ioc';
import { ExchangeRateNotificationServiceImpl } from '../../infrastructure/notification/exchange-rate-email.service';
import { FetchExchangeRateApplicationImpl } from '../fetch-exchange-rate.application';
import { SendExchangeRateToSubscribersApplicationImpl } from '../send-exchange-rate-to-subscribers.application';

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
  useClass: OpenexchangeratesClientImpl,
};

const appConfigService = {
  provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
  useClass: AppConfigServiceImpl,
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

jest.mock('nodemailer');

describe('SendExchangeRateToSubscribersApplicationImpl integration', () => {
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

  it('class should exist', () => {
    expect(application).toBeDefined();
  });

  it('should not send email if subscribers list is empty', async () => {
    await application.execute();
    expect(transporterMock.sendMail).toHaveBeenCalledTimes(0);
  });

  it('should email if subscribers list is not empty', async () => {
    const email = 'goodemail@gmail.com';
    await prisma.subscription.create({ data: { email } });

    await application.execute();

    expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Exchange Rate Service" <no-reply@exchangerateservice.com>',
      subject: 'Daily Exchange Rate',
      to: email,
      html: expect.anything(),
    });
  });
});
