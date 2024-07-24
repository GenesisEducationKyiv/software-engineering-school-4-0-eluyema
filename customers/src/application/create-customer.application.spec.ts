import { CreateSubscriptionApplicationImpl } from "./create-customer.application";
import { SubscriptionService } from "../domain/services/interfaces/customer.service.interface";

describe("CreateSubscriptionApplicationImpl", () => {
  let application: CreateSubscriptionApplicationImpl;
  let subscriptionService: SubscriptionService;

  class TestSubscriptionService implements SubscriptionService {
    create = jest.fn();
    getSubscribers = jest.fn();
  }

  beforeEach(async () => {
    subscriptionService = new TestSubscriptionService();
    application = new CreateSubscriptionApplicationImpl(subscriptionService);
  });

  it("should be defined", () => {
    expect(application).toBeDefined();
  });

  it("should return true on success created subscription", async () => {
    const email = "goodemail@gmail.com";
    jest.spyOn(subscriptionService, "create").mockResolvedValue(true);

    const result = await application.execute(email);

    expect(result).toEqual(true);
  });

  it("should return false when creating subscription failed", async () => {
    const email = "bademail@gmail.com";
    jest.spyOn(subscriptionService, "create").mockResolvedValue(false);

    const result = await application.execute(email);

    expect(result).toEqual(false);
  });
});
