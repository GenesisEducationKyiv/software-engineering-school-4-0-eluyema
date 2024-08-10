import { IsEmail } from "class-validator";

export class CustomerCreatedDto {
  @IsEmail()
  email: string;
}
