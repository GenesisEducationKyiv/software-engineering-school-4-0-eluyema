import { Rate } from "../entities/rate.entity";

export interface RateRepository {
  createOrUpdate(data: {
    name: string;
    rate: number;
    date: Date;
  }): Promise<Rate>;
  findAll(): Promise<Rate[]>;
  findByName(name: string): Promise<Rate | null>;
}
