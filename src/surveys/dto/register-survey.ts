import { IsNotEmpty } from 'class-validator';

export class RegisterSurvey {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  weekId: string;

  @IsNotEmpty()
  timeManagement: number;

  @IsNotEmpty()
  participation: number;
}
