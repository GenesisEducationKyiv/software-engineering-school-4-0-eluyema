import { IsEmail } from "class-validator";

export class CustomerRemoveFailedDto {
  @IsEmail()
  email: string;
}
