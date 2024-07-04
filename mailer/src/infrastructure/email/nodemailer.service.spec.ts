import * as nodemailer from 'nodemailer';

import { TestAppConfigServiceImpl } from 'srcdf/test-utils/config/test-app-config.service';

import { NodemailerServiceImpl } from './nodemailer.service';
import { MailerService } from '../../application/interfaces/mailer.service.interface';
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

    service = new NodemailerServiceImpl(new TestAppConfigServiceImpl());
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
