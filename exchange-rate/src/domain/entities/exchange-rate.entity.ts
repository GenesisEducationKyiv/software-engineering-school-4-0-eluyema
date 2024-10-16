export class ExchangeRate {
  constructor(
    public base: string,
    public rate: number,
    public date: Date,
  ) {}
}
