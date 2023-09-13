import { IsOptional } from 'class-validator';
import { Priority } from '../enum';

export class EditEvent {
  @IsOptional()
  summary: string;

  @IsOptional()
  description: string;

  @IsOptional()
  startDate: string;

  @IsOptional()
  endDate: string;

  @IsOptional()
  priority: Priority;
}
