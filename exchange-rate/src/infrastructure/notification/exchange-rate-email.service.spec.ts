import { ExchangeRateNotificationServiceImpl } from "./exchange-rate-email.service";
import { MailerService } from "./interfaces/mailer.service.interface";
import { EmailFactory } from "../../domain/factories/email.factory";
import { ExchangeRateFactory } from "../../domain/factories/exchange-rate.factory";
import { ExchangeRateEmailComposerService } from "../composers/interfaces/exchange-rate-email-composer-service.interface";

describe("ExchangeRateNotificationServiceImpl", () => {
  let service: ExchangeRateNotificationServiceImpl;
  let mailerService: MailerService;
  let emailComposerService: ExchangeRateEmailComposerService;

  class TestMailerService implements MailerService {
    sendEmail = jest.fn();
  }

  class TestExchangeRateEmailComposerService
    implements ExchangeRateEmailComposerService
  {
    composeExchangeRateEmail = jest.fn();
  }

  beforeEach(async () => {
    mailerService = new TestMailerService();
    emailComposerService = new TestExchangeRateEmailComposerService();
    service = new ExchangeRateNotificationServiceImpl(
      mailerService,
      emailComposerService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send email", async () => {
    const recipients = ["email1@gmail.com", "email2@gmail.com"];
    const exchangeRate = ExchangeRateFactory.create("USD", 28, new Date());
    const email = EmailFactory.create({
      to: recipients,
      subject: "Exchange rate",
      html: `<b>Exchange rate  - ${exchangeRate.rate}</b>`,
    });

    jest
      .spyOn(emailComposerService, "composeExchangeRateEmail")
      .mockImplementation(async () => email);

    await service.sendExchangeRateNotification(exchangeRate, recipients);

    expect(mailerService.sendEmail).toHaveBeenCalledWith(email);
  });
});
