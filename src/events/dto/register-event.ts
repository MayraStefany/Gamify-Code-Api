import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Priority } from '../enum';

export class RegisterEvent {
  @IsNotEmpty()
  summary: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;

  @IsEnum(Priority)
  priority: Priority = Priority.Low;

  @IsNotEmpty()
  user: string;

  @IsOptional()
  tokenInherited: string;

  @IsOptional()
  sent: boolean = false;

  @IsOptional()
  closed: boolean = false;

  @IsOptional()
  repeat: boolean = false;
}
