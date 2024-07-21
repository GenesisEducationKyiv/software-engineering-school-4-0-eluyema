import { Test, TestingModule } from "@nestjs/testing";

import { CustomerServiceImpl } from "./customer.service";
import { CustomerService } from "./interfaces/customer.service.interface";
import { TYPES } from "../../ioc/types";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";

describe("CustomerService", () => {
  let service: CustomerService;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerServiceImpl,
        {
          provide: TYPES.repositories.CustomerRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerServiceImpl);
    repository = module.get<CustomerRepository>(
      TYPES.repositories.CustomerRepository,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a customer", async () => {
    const email = "test@example.com";
    jest.spyOn(repository, "findByEmail").mockResolvedValue(null);
    await service.create(email);
    expect(repository.create).toHaveBeenCalledWith(email);
  });

  it("should not create a customer if email exists", async () => {
    const email = "test@example.com";
    jest
      .spyOn(repository, "findByEmail")
      .mockResolvedValue(new Customer("1", email));
    await service.create(email);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should get all customers", async () => {
    const customers = [
      new Customer("1", "test1@example.com"),
      new Customer("2", "test2@example.com"),
    ];
    jest.spyOn(repository, "findAll").mockResolvedValue(customers);
    const result = await service.getCustomers();
    expect(result).toEqual(customers);
  });
});
