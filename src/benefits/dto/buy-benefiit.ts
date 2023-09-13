import { IsNotEmpty } from 'class-validator';

export class BuyBenefit {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  benefitId: string;
}
