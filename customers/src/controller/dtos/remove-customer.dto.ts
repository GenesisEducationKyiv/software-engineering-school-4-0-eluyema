import { IsEmail } from "class-validator";

export class RemoveCustomerDto {
  @IsEmail()
  email: string;
}
