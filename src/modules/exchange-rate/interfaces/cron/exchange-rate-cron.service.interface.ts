export interface ExchangeRateCronService {
  handleCron(): Promise<void>;
}
