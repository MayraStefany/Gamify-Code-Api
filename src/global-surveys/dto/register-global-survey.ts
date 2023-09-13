import { IsNotEmpty } from 'class-validator';

export class RegisterGlobalSurvey {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  participation: number;

  @IsNotEmpty()
  taskCompletion: number;

  @IsNotEmpty()
  timeManagement: number;
}
