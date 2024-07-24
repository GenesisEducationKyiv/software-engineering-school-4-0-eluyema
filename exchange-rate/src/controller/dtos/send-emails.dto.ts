import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class SendEmailsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  emails: string[];
}
