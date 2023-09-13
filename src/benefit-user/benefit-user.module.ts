import { Module } from '@nestjs/common';
import { BenefitUserService } from './benefit-user.service';
import { BenefitUser } from './benefit-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BenefitUser])],
  providers: [BenefitUserService],
  exports: [BenefitUserService],
})
export class BenefitUserModule {}
