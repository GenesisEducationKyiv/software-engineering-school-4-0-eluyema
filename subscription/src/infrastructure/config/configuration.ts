import { AppConfig } from "./interfaces/configuration.interface";

export const RequiredEnvVars = [
  "SERVER_PORT",
  "SERVER_HOST",
  "DATABASE_URL",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
  "DATABASE_DB",
  "MICROSERVICE_EXCHANGE_RATE_URL",
  "CRON_SCHEDULE_PATTERN",
  "BROKER_HOST",
  "BROKER_GROUP_ID",
  "EXCHANGE_RATE_BROKER_HOST",
  "EXCHANGE_RATE_BROKER_GROUP_ID",
];

const DEFAULT_SERVER_PORT = 3000;

export const configuration = (): AppConfig => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
      host: process.env.SERVER_HOST,
    },
    cron: {
      pattern: process.env.CRON_SCHEDULE_PATTERN,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    microservices: {
      exchangeRateUrl: process.env.MICROSERVICE_EXCHANGE_RATE_URL,
    },
    messageBrokers: {
      current: {
        host: process.env.BROKER_HOST,
        groupId: process.env.BROKER_GROUP_ID,
      },
      exchangeRate: {
        host: process.env.EXCHANGE_RATE_BROKER_HOST,
        groupId: process.env.EXCHANGE_RATE_BROKER_GROUP_ID,
      },
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
