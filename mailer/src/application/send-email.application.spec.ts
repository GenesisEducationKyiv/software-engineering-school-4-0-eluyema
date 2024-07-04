import { MailerService } from './interfaces/mailer.service.interface';
import { SendEmailApplicationImpl } from './send-email.application';
import { EmailFactory } from '../domain/factories/email.factory';

describe('SendEmailApplicationImpl', () => {
  let application: SendEmailApplicationImpl;
  let emailService: MailerService;

  class TestMailerService implements MailerService {
    sendEmail = jest.fn();
  }

  beforeEach(async () => {
    emailService = new TestMailerService();
    application = new SendEmailApplicationImpl(emailService);
  });

  it('should be defined', () => {
    expect(application).toBeDefined();
  });

  it('should call send mail only once', async () => {
    const email = EmailFactory.create({
      to: ['email1@gmail.com', 'email2@gmail.com'],
      subject: 'Exchange rate',
      html: `<b>Exchange rate  - 18</b>`,
    });
    await application.execute(email);
    expect(emailService.sendEmail).toHaveBeenCalledWith(email);
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
  });
});
