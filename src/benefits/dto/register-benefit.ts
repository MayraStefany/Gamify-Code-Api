import { IsNotEmpty } from 'class-validator';

export class RegisterBenefit {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  points: number;
}
