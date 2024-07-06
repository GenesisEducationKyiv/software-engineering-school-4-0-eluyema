import { AppConfig } from "./interfaces/configuration.interface";

export const RequiredEnvVars = [
  "SERVER_PORT",
  "SERVER_HOST",
  "OPENEXCHANGERATES_EXCHANGE_API_URL",
  "BANK_GOV_EXCHANGE_API_URL",
  "PRIVATBANK_EXCHANGE_API_URL",
  "MICROSERVICE_MAILER_URL",
];

const DEFAULT_SERVER_PORT = 3000;

export const configuration = (): AppConfig => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
      host: process.env.SERVER_HOST,
    },
    exchangeApi: {
      openexchangeratesUrl: process.env.OPENEXCHANGERATES_EXCHANGE_API_URL,
      privatbankUrl: process.env.PRIVATBANK_EXCHANGE_API_URL,
      bankgovUrl: process.env.BANK_GOV_EXCHANGE_API_URL,
    },
    microservices: {
      mailerUrl: process.env.MICROSERVICE_MAILER_URL,
    },
  } as AppConfig;

  return defaultConfiguration;
};

export const validateEnvironmentVars = (): void => {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = "development";
  }

  RequiredEnvVars.forEach((v) => {
    if (!process.env[v]) throw Error(`Missing required env variable ${v}`);
  });
};
