export class Email {
  public to: string[];
  public subject: string;
  public text: string;
  public html: string;

  constructor(data: {
    to: string[];
    subject: string;
    text: string;
    html: string;
  }) {
    this.to = data.to;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
  }
}
