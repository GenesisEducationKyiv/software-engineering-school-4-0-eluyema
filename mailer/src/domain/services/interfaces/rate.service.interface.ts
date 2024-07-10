import { Rate } from "src/domain/entities/rate.entity";

export interface RateService {
  getRate(): Promise<Rate>;
  updateRate(rate: Rate): Promise<void>;
}
