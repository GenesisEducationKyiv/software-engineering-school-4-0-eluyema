import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { TYPES } from 'src/ioc';

import { MailerService } from '../../application/interfaces/mailer.service.interface';
import { Email } from '../../domain/entities/email.entity';
import { AppConfigService } from '../config/interfaces/app-config.service.interface';

@Injectable()
export class NodemailerServiceImpl implements MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(TYPES.infrastructure.AppConfigService)
    readonly appConfigService: AppConfigService,
  ) {
    const mailerConfig = appConfigService.mailer;

    this.transporter = nodemailer.createTransport({
      host: mailerConfig.host,
      port: mailerConfig.port,
      secure: false,
      auth: {
        user: mailerConfig.user,
        pass: mailerConfig.password,
      },
    });
  }

  async sendEmail(email: Email): Promise<void> {
    await this.transporter.sendMail({
      from: '"Exchange Rate Service" <no-reply@exchangerateservice.com>',
      to: email.to.join(', '),
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  }
}
