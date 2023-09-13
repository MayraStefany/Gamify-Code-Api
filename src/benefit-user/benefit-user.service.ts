import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitUser } from './benefit-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BenefitUserService {
  constructor(
    @InjectRepository(BenefitUser)
    private benefitUserRepository: Repository<BenefitUser>,
  ) {}

  async createBenefitUser(dto: { benefitId: string; userId: string }) {
    const benefitUser = this.benefitUserRepository.create({
      benefitId: dto.benefitId,
      userId: dto.userId,
    });

    return await this.benefitUserRepository.save(benefitUser);
  }

  async getBenefitsByUserId(userId: string) {
    return await this.benefitUserRepository.find({
      where: {
        userId,
      },
    });
  }
}
