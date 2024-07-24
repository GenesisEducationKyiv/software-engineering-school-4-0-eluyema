export type SubscriptionStatus = "PENDING" | "ACTIVE";

export class Subscription {
  constructor(
    public id: string,
    public email: string,
    public status: SubscriptionStatus,
  ) {}
}
