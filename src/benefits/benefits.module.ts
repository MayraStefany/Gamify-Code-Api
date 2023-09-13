import { Module, forwardRef } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './benefit.entity';
import { UserModule } from 'src/user/user.module';
import { BenefitUserModule } from 'src/benefit-user/benefit-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Benefit]),
    forwardRef(() => UserModule),
    forwardRef(() => BenefitUserModule),
  ],
  providers: [BenefitsService],
  controllers: [BenefitsController],
})
export class BenefitsModule {}
