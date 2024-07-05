import { PrismaClient, Subscription } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';

import { PrismaSubscriptionRepositoryImpl } from './prisma-subscription.repository';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { prismaMock } from '../../test-utils/database/mocked-prisma';

describe('PrismaSubscriptionRepositoryImpl', () => {
  let repository: PrismaSubscriptionRepositoryImpl;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaService = prismaMock;

    repository = new PrismaSubscriptionRepositoryImpl(
      prismaService as unknown as PrismaService,
    );
  });

  it('should create a new subscription and return it', async () => {
    const email = 'test@example.com';
    prismaService.subscription.create.mockResolvedValue({
      id: 'superid',
      email,
    });

    const subscription = await repository.create(email);

    expect(prismaService.subscription.create).toHaveBeenCalledWith({
      data: { email },
    });
    expect(subscription.email).toEqual(email);
  });

  it('should find a subscription by email and return it', async () => {
    const email = 'test@example.com';
    prismaService.subscription.findUnique.mockResolvedValue({
      id: 'superid',
      email,
    });
    const subscription = await repository.findByEmail(email);

    expect(prismaService.subscription.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(subscription).toBeDefined();
    expect(subscription?.email).toEqual(email);
  });

  it('should return null if subscription not found by email', async () => {
    prismaService.subscription.findUnique.mockResolvedValue(null);
    const email = 'notfound@example.com';
    const subscription = await repository.findByEmail(email);

    expect(subscription).toBeNull();
  });

  it('should return all subscriptions', async () => {
    const expectedSubscriptions: Subscription[] = [
      {
        id: 'dfsafasdfasd',
        email: 'test@example.com',
      },
    ];

    prismaService.subscription.findMany.mockResolvedValue(
      expectedSubscriptions,
    );

    const subscriptions = await repository.findAll();

    expect(prismaService.subscription.findMany).toHaveBeenCalled();
    expect(subscriptions[0].email).toEqual(expectedSubscriptions[0].email);
  });
});
