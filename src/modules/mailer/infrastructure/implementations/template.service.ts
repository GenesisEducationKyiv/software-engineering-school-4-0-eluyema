// src/mailer/services/template.service.ts
import { readFile } from 'fs/promises';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import * as hbs from 'handlebars';

import { TemplateService } from '../../interfaces/services/template.service.interface';

@Injectable()
export class HandlebarsTemplateService implements TemplateService {
  async renderTemplate(template: string, context: unknown): Promise<string> {
    const templatePath = join(__dirname, '..', 'templates', `${template}.hbs`);
    const templateContent = await readFile(templatePath, 'utf8');
    const compiledTemplate = hbs.compile(templateContent);
    return compiledTemplate(context);
  }
}
