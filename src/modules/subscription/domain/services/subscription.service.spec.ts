import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { ISubscriptionRepository } from '../repositories/subscription.repository';
import { Subscription } from '../entities/subscription.entity';
import { TYPES } from '../../interfaces/types';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: ISubscriptionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: TYPES.repositories.SubscriptionRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<ISubscriptionRepository>(
      TYPES.repositories.SubscriptionRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a subscription', async () => {
    const email = 'test@example.com';
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    await service.create(email);
    expect(repository.create).toHaveBeenCalledWith(email);
  });

  it('should not create a subscription if email exists', async () => {
    const email = 'test@example.com';
    jest
      .spyOn(repository, 'findByEmail')
      .mockResolvedValue(new Subscription('1', email));
    await service.create(email);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should get all subscribers', async () => {
    const subscribers = [
      new Subscription('1', 'test1@example.com'),
      new Subscription('2', 'test2@example.com'),
    ];
    jest.spyOn(repository, 'findAll').mockResolvedValue(subscribers);
    const result = await service.getSubscribers();
    expect(result).toEqual(subscribers.map((sub) => sub.email));
  });
});
