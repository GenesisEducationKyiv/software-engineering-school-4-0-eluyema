import { IsEmail } from "class-validator";

export class SubscriptionCreatedDto {
  @IsEmail()
  email: string;
}
