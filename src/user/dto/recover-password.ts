import { IsNotEmpty } from 'class-validator';

export class RecoverPassword {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  recoverCode: string;
}
