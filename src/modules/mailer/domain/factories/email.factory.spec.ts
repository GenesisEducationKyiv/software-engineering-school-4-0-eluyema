import { EmailFactory } from './email.factory';

describe('EmailFactory', () => {
  it('should create correct email with text and subject', () => {
    const data = {
      to: ['goodemail@gmail.com'],
      subject: 'Good news',
      text: 'The weather is good today!',
    };
    const email = EmailFactory.create(data);
    expect(email).toBeDefined();
    expect(email.text).toEqual(data.text);
    expect(email.to).toEqual(data.to);
    expect(email.subject).toEqual(data.subject);
    expect(email.html).toBeUndefined();
  });

  it('should create correct email with html and subject', () => {
    const data = {
      to: ['goodemail@gmail.com'],
      subject: 'Good news',
      html: '<b>The weather is good today!</b>',
    };
    const email = EmailFactory.create(data);
    expect(email).toBeDefined();
    expect(email.html).toEqual(data.html);
    expect(email.to).toEqual(data.to);
    expect(email.subject).toEqual(data.subject);
    expect(email.text).toBeUndefined();
  });

  it('should create correct email with several recipients', () => {
    const data = {
      to: [
        'recipient1@gmail.com',
        'recipient2@gmail.com',
        'recipient3@gmail.com',
        'recipient4@gmail.com',
      ],
      subject: 'Good news',
      html: '<b>The weather is good today!</b>',
    };
    const email = EmailFactory.create(data);
    expect(email).toBeDefined();
    expect(email.html).toEqual(data.html);
    expect(email.to).toEqual(data.to);
    expect(email.subject).toEqual(data.subject);
    expect(email.text).toBeUndefined();
  });

  it('should throw an error with empty recipients', () => {
    const data = {
      to: [],
      subject: 'Good news',
      html: '<b>The weather is good today!</b>',
    };
    expect(() => {
      const email = EmailFactory.create(data);
      expect(email).toBeUndefined();
    }).toThrow(`Recipient array can't be empty`);
  });

  it('should throw an error with uncorrect emails of recipients', () => {
    const data = {
      to: [
        'recipient1@gmail.',
        'recipient2@gmail.com',
        'recipient3@gmail.com',
        'recipient4@gmail.com',
      ],
      subject: 'Good news',
      html: '<b>The weather is good today!</b>',
    };
    expect(() => {
      EmailFactory.create(data);
    }).toThrow('Invalid email addresses: recipient1@gmail.');
  });
});
