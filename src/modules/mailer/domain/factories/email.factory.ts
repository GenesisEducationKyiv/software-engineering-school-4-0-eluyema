import { Email } from '../entities/email.entity';

export class EmailFactory {
  static create(data: {
    to: string[];
    subject?: string;
    text?: string;
    html?: string;
  }) {
    const { to, subject, text, html } = data;

    this.validateEmailAddresses(to);

    return new Email(to, subject, text, html);
  }

  private static validateEmailAddresses(emailAddresses: string[]): void {
    const emailRegex =
      /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/;
    const invalidEmails = emailAddresses.filter(
      (email) => !emailRegex.test(email),
    );

    if (!emailAddresses.length) {
      throw new Error(`Recipient array can't be empty`);
    }

    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
    }
  }
}
