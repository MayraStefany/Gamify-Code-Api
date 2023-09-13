import { IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUser {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  points: number = 0;

  @IsOptional()
  isAdmin: boolean = false;

  @IsOptional()
  recoverCode: string = null;
}
