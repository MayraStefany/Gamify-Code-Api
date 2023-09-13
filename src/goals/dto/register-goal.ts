import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterGoal {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  date: string;

  @IsOptional()
  complete: boolean = false;
}
