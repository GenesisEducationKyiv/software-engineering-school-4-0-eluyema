export interface ExchangeRateCronService {
  onModuleInit(): Promise<void>;
  handleCron(): Promise<void>;
}
