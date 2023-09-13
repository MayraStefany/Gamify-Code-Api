import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class WeekDto {
  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  start: string;

  @IsNotEmpty()
  end: string;
}

export class RegisterWeek {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => WeekDto)
  weeks: WeekDto[];
}
