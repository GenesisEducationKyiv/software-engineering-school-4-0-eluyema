import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailService } from '../../interfaces/services/email.service.interface';
import { Email } from '../../domain/entities/email.entity';

@Injectable()
export class NodemailerService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mailer.host'),
      port: this.configService.get('mailer.port'),
      secure: false,
      auth: {
        user: this.configService.get('mailer.user'),
        pass: this.configService.get('mailer.password'),
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
