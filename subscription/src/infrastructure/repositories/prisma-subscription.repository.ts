import { Inject, Injectable } from "@nestjs/common";

import { TYPES } from "src/ioc";

import { SubscriptionCreatedDto } from "./dtos/subscription-created.dto";
import { SubscriptionRemovedDto } from "./dtos/subscription-removed.dto";
import {
  Subscription,
  SubscriptionStatus,
} from "../../domain/entities/subscription.entity";
import { SubscriptionRepository } from "../../domain/repositories/subscription.repository";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { EventNotificationService } from "../notification/interfaces/event-notification.service.interface";

@Injectable()
export class PrismaSubscriptionRepositoryImpl
  implements SubscriptionRepository
{
  constructor(
    private readonly prisma: PrismaService,
    @Inject(TYPES.infrastructure.EventMailerNotificationService)
    private readonly eventNotificationService: EventNotificationService,
  ) {}

  async create(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.create({
      data: { email },
    });

    // todo: think about to use decorator pattern for it
    await this.eventNotificationService.emitEvent<SubscriptionCreatedDto>(
      "subscription-created",
      { email },
    );
    return new Subscription(
      subscription.id,
      subscription.email,
      subscription.status,
    );
  }

  async delete(email: string): Promise<void> {
    await this.prisma.subscription.delete({
      where: { email },
    });

    await this.eventNotificationService.emitEvent<SubscriptionRemovedDto>(
      "subscription-removed",
      { email },
    );
  }

  async findByEmail(email: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });
    return subscription
      ? new Subscription(
          subscription.id,
          subscription.email,
          subscription.status,
        )
      : null;
  }

  async findAll(): Promise<Subscription[]> {
    const subscriptions = await this.prisma.subscription.findMany();
    return subscriptions.map(
      (subscription) =>
        new Subscription(
          subscription.id,
          subscription.email,
          subscription.status,
        ),
    );
  }

  async updateStatus(email: string, status: SubscriptionStatus) {
    await this.prisma.subscription.update({
      where: {
        email,
      },
      data: {
        status: status,
      },
    });
  }
}
