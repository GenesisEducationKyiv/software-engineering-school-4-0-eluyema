import { IsArray, IsOptional, IsString } from 'class-validator';

export class SendEmailsDto {
  @IsArray()
  @IsString({ each: true })
  to: string[];

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;
}
