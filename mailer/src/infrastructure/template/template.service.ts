import { readFile } from "fs/promises";
import { join } from "path";

import { Injectable, Logger } from "@nestjs/common";
import * as hbs from "handlebars";

import { TemplateService } from "./interfaces/template.service.interface";

@Injectable()
export class HandlebarsTemplateServiceImpl implements TemplateService {
  private readonly logger = new Logger(this.constructor.name);

  async renderTemplate(template: string, context: unknown): Promise<string> {
    try {
      this.logger.log(
        `Render template ${template} with context ${context} started`,
      );
      const templatePath = join(
        __dirname,
        "../../../",
        "assets",
        "templates",
        `${template}.hbs`,
      );

      const templateContent = await readFile(templatePath, "utf8");
      this.logger.log(
        `Read content ${template} with context ${context} success`,
      );
      const compiledTemplate = hbs.compile(templateContent);
      const data = compiledTemplate(context);
      this.logger.log(
        `Render template ${template} with context ${context} success`,
      );
      return data;
    } catch (err) {
      this.logger.error(
        `Render template ${template} with context ${context} failed! Error: ${err.message}`,
      );
      throw err;
    }
  }
}
