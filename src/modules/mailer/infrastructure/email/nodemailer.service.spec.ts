import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

import { TYPES as SHARED_CONFIG_TYPES } from 'src/shared/infrastructure/ioc';
import { TestAppConfigServiceImpl } from 'src/test-utils/config/test-app-config.service';

import { MailerService } from './interfaces/mailer.service.interface';
import { NodemailerServiceImpl } from './nodemailer.service';
import { Email } from '../../domain/entities/email.entity';

jest.mock('nodemailer');

describe('NodemailerService', () => {
  let service: MailerService;
  let transporterMock: Partial<jest.Mocked<nodemailer.Transporter>>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({}),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodemailerServiceImpl,
        {
          provide: SHARED_CONFIG_TYPES.infrastructure.AppConfigService,
          useClass: TestAppConfigServiceImpl,
        },
      ],
    }).compile();

    service = module.get<MailerService>(NodemailerServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    const email = new Email(
      ['test@example.com'],
      'Subject',
      'Text content',
      '<p>HTML content</p>',
    );
    await service.sendEmail(email);
    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Exchange Rate Service" <no-reply@exchangerateservice.com>',
      to: 'test@example.com',
      subject: 'Subject',
      text: 'Text content',
      html: '<p>HTML content</p>',
    });
  });
});
