import { IsEmail } from "class-validator";

export class CustomerRemovedDto {
  @IsEmail()
  email: string;
}
