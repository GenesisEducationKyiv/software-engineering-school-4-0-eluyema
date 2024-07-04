export const TYPES = {
  applications: {
    SendEmailApplication: Symbol('SendEmailApplication'),
  },
  services: {
    EmailService: Symbol('EmailService'),
    TemplateService: Symbol('TemplateService'),
  },
  infrastructure: {
    AppConfigService: Symbol('AppConfigService'),
  },
};
