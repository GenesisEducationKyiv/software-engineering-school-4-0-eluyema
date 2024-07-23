import { IsEmail } from "class-validator";

export class SubscriptionRemovedDto {
  @IsEmail()
  email: string;
}
