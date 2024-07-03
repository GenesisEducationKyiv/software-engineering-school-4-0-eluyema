import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

import { Subscription } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

@Injectable()
export class PrismaSubscriptionRepositoryImpl
  implements SubscriptionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.create({
      data: { email },
    });
    return new Subscription(subscription.id, subscription.email);
  }

  async findByEmail(email: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });
    return subscription
      ? new Subscription(subscription.id, subscription.email)
      : null;
  }

  async findAll(): Promise<Subscription[]> {
    const subscriptions = await this.prisma.subscription.findMany();
    return subscriptions.map(
      (subscription) => new Subscription(subscription.id, subscription.email),
    );
  }
}
