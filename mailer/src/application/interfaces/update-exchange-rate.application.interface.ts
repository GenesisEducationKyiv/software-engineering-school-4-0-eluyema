import { Rate } from "src/domain/entities/rate.entity";

export interface UpdateExchangeRateApplication {
  execute(exchangeRate: Rate): Promise<void>;
}
