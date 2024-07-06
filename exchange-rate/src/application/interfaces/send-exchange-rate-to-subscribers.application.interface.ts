export interface SendExchangeRateToSubscribersApplication {
  execute(subscriberEmails: string[]): Promise<void>;
}
