import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterNotification {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  message: string;
}
