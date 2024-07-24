import { Email } from "../entities/email.entity";

export class EmailFactory {
  static create(data: {
    to: string[];
    subject?: string;
    text?: string;
    html?: string;
  }) {
    const { to, subject, text, html } = data;

    return new Email({ to, subject, text, html });
  }
}
