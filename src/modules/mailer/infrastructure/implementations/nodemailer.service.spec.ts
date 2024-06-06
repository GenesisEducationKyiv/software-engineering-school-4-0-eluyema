import { Test, TestingModule } from '@nestjs/testing';
import { NodemailerService } from './nodemailer.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Email } from '../../domain/entities/email.entity';

jest.mock('nodemailer');

describe('NodemailerService', () => {
  let service: NodemailerService;
  let transporterMock: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({}),
    } as any;

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodemailerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                MAIL_HOST: 'smtp.mailtrap.io',
                MAIL_PORT: 2525,
                MAIL_USER: 'username',
                MAIL_PASSWORD: 'password',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NodemailerService>(NodemailerService);
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
