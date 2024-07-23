import { IsNumber, IsString } from "class-validator";

export class RateUpdatedDto {
  @IsString()
  name: string;

  @IsNumber()
  rate: number;

  @IsNumber()
  timestamp: number;
}
