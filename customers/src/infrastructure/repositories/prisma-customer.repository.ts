import { Inject, Injectable } from "@nestjs/common";

import { TYPES } from "src/ioc";

import { CustomerCreatedDto } from "./dtos/customer-created.dto";
import { CustomerRemovedDto } from "./dtos/customer-removed.dto";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { EventNotificationService } from "../notification/interfaces/event-notification.service.interface";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaCustomerRepositoryImpl implements CustomerRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(TYPES.infrastructure.EventNotificationService)
    private readonly eventNotificationService: EventNotificationService,
  ) {}

  async create(email: string): Promise<Customer> {
    const customer = await this.prisma.customer.create({
      data: { email },
    });

    // todo: think about to use decorator pattern for it
    this.eventNotificationService.emitEvent<CustomerCreatedDto>(
      "customer-created",
      { email },
    );
    return new Customer(customer.id, customer.email);
  }

  async delete(email: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { email },
    });

    this.eventNotificationService.emitEvent<CustomerRemovedDto>(
      "customer-removed",
      { email },
    );
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const subscription = await this.prisma.customer.findUnique({
      where: { email },
    });
    return subscription
      ? new Customer(subscription.id, subscription.email)
      : null;
  }

  async findAll(): Promise<Customer[]> {
    return await this.prisma.customer.findMany();
  }
}
