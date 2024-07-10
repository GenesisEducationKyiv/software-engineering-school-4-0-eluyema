import { AvailableTemplatesEnum } from "src/domain/entities/template.entity";

export interface TemplateService {
  renderTemplate(
    template: AvailableTemplatesEnum,
    context: unknown,
  ): Promise<string>;
}
