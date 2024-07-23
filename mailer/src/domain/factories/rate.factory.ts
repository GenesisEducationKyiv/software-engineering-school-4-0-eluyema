import { Injectable } from "@nestjs/common";

import { Rate } from "../entities/rate.entity";

@Injectable()
export class RateFactory {
  static create(data: { name: string; rate: number; date: Date }): Rate {
    return new Rate(data.name, data.rate, data.date);
  }
}
