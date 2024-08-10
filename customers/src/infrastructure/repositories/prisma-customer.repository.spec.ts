import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";

import { PrismaCustomerRepositoryImpl } from "./prisma-customer.repository";
import { Customer } from "../../domain/entities/customer.entity";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { prismaMock } from "../../test-utils/database/mocked-prisma";

describe("PrismaCustomerRepositoryImpl", () => {
  let repository: PrismaCustomerRepositoryImpl;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaService = prismaMock;

    repository = new PrismaCustomerRepositoryImpl(
      prismaService as unknown as PrismaService,
    );
  });

  it("should create a new customer and return it", async () => {
    const email = "test@example.com";
    prismaService.customer.create.mockResolvedValue({
      id: "superid",
      email,
    });

    const customer = await repository.create(email);

    expect(prismaService.customer.create).toHaveBeenCalledWith({
      data: { email },
    });
    expect(customer.email).toEqual(email);
  });

  it("should find a customer by email and return it", async () => {
    const email = "test@example.com";
    prismaService.customer.findUnique.mockResolvedValue({
      id: "superid",
      email,
    });
    const customer = await repository.findByEmail(email);

    expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(customer).toBeDefined();
    expect(customer?.email).toEqual(email);
  });

  it("should return null if customer not found by email", async () => {
    prismaService.customer.findUnique.mockResolvedValue(null);
    const email = "notfound@example.com";
    const customer = await repository.findByEmail(email);

    expect(customer).toBeNull();
  });

  it("should return all customers", async () => {
    const expectedCustomers: Customer[] = [
      {
        id: "dfsafasdfasd",
        email: "test@example.com",
      },
    ];

    prismaService.customer.findMany.mockResolvedValue(expectedCustomers);

    const customers = await repository.findAll();

    expect(prismaService.customer.findMany).toHaveBeenCalled();
    expect(customers[0].email).toEqual(expectedCustomers[0].email);
  });
});
