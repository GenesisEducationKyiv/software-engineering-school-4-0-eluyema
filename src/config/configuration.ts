export const RequiredEnvVars = [
  'SERVER_PORT',
  'SERVER_HOST',
  'DATABASE_URL',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_DB',
  'EXCHANGE_API_URL',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASSWORD',
];

interface Configuration {
  server: {
    port: number;
    host: string;
  };
  database: {
    url: string;
  };
  exchangeApi: {
    url: string;
  };
  mailer: {
    host: string;
    port: string;
    user: string;
    password: string;
  };
}

const DEFAULT_SERVER_PORT = 3000;

export const configuration = (): Configuration => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
      host: process.env.SERVER_HOST,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    exchangeApi: {
      url: process.env.EXCHANGE_API_URL,
    },
    mailer: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
    },
  };

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
