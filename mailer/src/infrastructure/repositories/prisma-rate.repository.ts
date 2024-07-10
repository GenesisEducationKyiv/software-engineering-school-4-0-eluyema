import { Injectable } from "@nestjs/common";

import { Rate } from "src/domain/entities/rate.entity";
import { RateFactory } from "src/domain/factories/rate.factory";
import { RateRepository } from "src/domain/repositories/rate.repository";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaRateRepositoryImpl implements RateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(data: {
    name: string;
    rate: number;
    date: Date;
  }): Promise<Rate> {
    const rateEntity = await this.prisma.rate.upsert({
      where: {
        name: data.name,
      },
      create: { ...data },
      update: { ...data },
    });

    return RateFactory.create({
      date: rateEntity.date,
      name: rateEntity.name,
      rate: rateEntity.rate,
    });
  }

  async findByName(name: string): Promise<Rate | null> {
    const rateEntity = await this.prisma.rate.findUnique({
      where: { name },
    });
    return rateEntity
      ? RateFactory.create({
          date: rateEntity.date,
          name: rateEntity.name,
          rate: rateEntity.rate,
        })
      : null;
  }

  async findAll(): Promise<Rate[]> {
    const rates = await this.prisma.rate.findMany();
    return rates.map((rateEntity) =>
      RateFactory.create({
        date: rateEntity.date,
        name: rateEntity.name,
        rate: rateEntity.rate,
      }),
    );
  }
}
