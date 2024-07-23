export interface CurrentRateCronService {
  handleCron(): Promise<void>;
}
