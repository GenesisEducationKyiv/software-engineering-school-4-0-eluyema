import { IsEmail } from "class-validator";

export class CustomerCreateFailedDto {
  @IsEmail()
  email: string;
}
