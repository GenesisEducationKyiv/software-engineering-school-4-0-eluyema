import { AvailableTemplatesEnum } from '../../domain/entities/template.entity';

export interface TemplateService {
  renderTemplate(
    template: AvailableTemplatesEnum,
    context: any,
  ): Promise<string>;
}
