import { ExchangeRateEmailComposerServiceImpl } from "./exchange-rate-email-composer.service";
import { Email } from "../../domain/entities/email.entity";
import { ExchangeRateFactory } from "../../domain/factories/exchange-rate.factory";
import { TemplateService } from "../notification/interfaces/template.service.interface";

describe("ExchangeRateEmailComposerServiceImpl", () => {
  let service: ExchangeRateEmailComposerServiceImpl;
  let templateService: TemplateService;

  class TestTemplateService implements TemplateService {
    renderTemplate = jest.fn();
  }

  beforeEach(async () => {
    templateService = new TestTemplateService();
    service = new ExchangeRateEmailComposerServiceImpl(templateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return correct email", async () => {
    const exchangeRate = ExchangeRateFactory.create("USD", 28, new Date());
    const recipients = ["email1@gmail.com", "email2@gmail.com"];

    const html = `<b>Hi! Exchange Rate - ${exchangeRate.rate}</b>`;

    jest.spyOn(templateService, "renderTemplate").mockResolvedValue(html);

    const expectedEmail = new Email({
      to: recipients,
      subject: "Daily Exchange Rate",
      text: undefined,
      html,
    });

    const email = await service.composeExchangeRateEmail(
      exchangeRate,
      recipients,
    );

    expect(email).toEqual(expectedEmail);
  });

  it("should throw error with incorrect recipients", async () => {
    const exchangeRate = ExchangeRateFactory.create("USD", 28, new Date());
    const recipients = ["email1gmail.com", "email2@gmail.com"];

    const html = `<b>Hi! Exchange Rate - ${exchangeRate.rate}</b>`;

    jest.spyOn(templateService, "renderTemplate").mockResolvedValue(html);

    service
      .composeExchangeRateEmail(exchangeRate, recipients)
      .then((email) => expect(email).toBeUndefined())
      .catch((err) => expect(err).toBeDefined());
  });
});
