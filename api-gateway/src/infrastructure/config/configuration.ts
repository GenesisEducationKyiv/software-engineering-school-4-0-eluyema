import { AppConfig } from './interfaces/configuration.interface';

export const RequiredEnvVars = [
  'SERVER_PORT',
  'SERVER_HOST',
  'MICROSERVICE_SUBSCRIPTION_URL',
  'MICROSERVICE_EXCHANGE_RATE_URL',
];

const DEFAULT_SERVER_PORT = 3000;

export const configuration = (): AppConfig => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
      host: process.env.SERVER_HOST,
    },
    microservices: {
      subscriptionUrl: process.env.MICROSERVICE_SUBSCRIPTION_URL,
      exchangeRateUrl: process.env.MICROSERVICE_EXCHANGE_RATE_URL,
    },
  } as AppConfig;

  return defaultConfiguration;
};

export const validateEnvironmentVars = (): void => {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'development';
  }

  RequiredEnvVars.forEach((v) => {
    if (!process.env[v]) throw Error(`Missing required env variable ${v}`);
  });
};
