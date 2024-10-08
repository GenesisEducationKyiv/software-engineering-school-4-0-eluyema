import { readFile } from "fs/promises";
import { join } from "path";

import * as hbs from "handlebars";

import { TemplateService } from "./interfaces/template.service.interface";
import { HandlebarsTemplateServiceImpl } from "./template.service";
import { AvailableTemplatesEnum } from "../../domain/entities/template.entity";

jest.mock("fs/promises");
jest.mock("handlebars");

describe("HandlebarsTemplateService", () => {
  let service: TemplateService;

  beforeEach(async () => {
    service = new HandlebarsTemplateServiceImpl();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should render template", async () => {
    const templateName = AvailableTemplatesEnum.EXCHANGE_RATE;
    const context = { rate: 28, date: "2021-08-01" };
    const templateContent =
      "<p>The exchange rate is {{rate}} as of {{date}}.</p>";
    const expectedResult = "<p>The exchange rate is 28 as of 2021-08-01.</p>";

    (readFile as jest.Mock).mockResolvedValue(templateContent);
    const compiledTemplate = jest.fn().mockReturnValue(expectedResult);
    (hbs.compile as jest.Mock).mockReturnValue(compiledTemplate);

    const result = await service.renderTemplate(templateName, context);
    expect(result).toBe(expectedResult);
    expect(readFile).toHaveBeenCalledWith(
      join(__dirname, "templates", `${templateName}.hbs`),
      "utf8",
    );
    expect(hbs.compile).toHaveBeenCalledWith(templateContent);
    expect(compiledTemplate).toHaveBeenCalledWith(context);
  });
});
