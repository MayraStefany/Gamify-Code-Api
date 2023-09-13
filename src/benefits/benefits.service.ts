import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Benefit } from './benefit.entity';
import { Repository } from 'typeorm';
import { BuyBenefit, RegisterBenefit } from './dto';
import { ObjectID } from 'mongodb';
import { UserService } from 'src/user/user.service';
import { BenefitUserService } from 'src/benefit-user/benefit-user.service';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(Benefit)
    private benefitRepository: Repository<Benefit>,
    private userService: UserService,
    private benefitUserService: BenefitUserService,
  ) {}

  async createBenefit(file: Express.Multer.File, dto: RegisterBenefit) {
    const fileB64 = file.buffer.toString('base64');
    const benefit = this.benefitRepository.create({
      ...dto,
      file: fileB64,
      extension: file.originalname.split('.').pop(),
      type: file.mimetype,
    });

    return await this.benefitRepository.save(benefit);
  }

  async getAllBenefits() {
    const response = await this.benefitRepository.find({});
    return response.map((x) => ({
      ...x,
      points: Number(x.points),
    }));
  }

  async buyBenefit(dto: BuyBenefit) {
    const benefit = await this.benefitRepository.findOne({
      where: {
        _id: new ObjectID(dto.benefitId),
      },
    });

    const user = await this.userService.findUserById(dto.userId);

    if (!benefit) throw new NotFoundException('No existe el beneficio.');
    if (!user) throw new NotFoundException('No existe el usuario.');

    const benefitsUser = await this.benefitUserService.getBenefitsByUserId(
      dto.userId,
    );

    const hasThatBenefit = benefitsUser.some(
      ({ benefitId }) => benefitId === dto.benefitId,
    );

    if (hasThatBenefit) {
      throw new HttpException({ message: 'Ya posees este beneficio.' }, 503);
    }

    if (user.points < benefit.points)
      throw new HttpException(
        { message: 'No cuentas con los puntos suficientes.' },
        503,
      );

    const refreshPoints = user.points - benefit.points;

    await this.userService.updateUserById(user._id, {
      points: refreshPoints,
    });

    await this.benefitUserService.createBenefitUser({
      benefitId: benefit._id.toString(),
      userId: user._id.toString(),
    });

    return { points: refreshPoints };
  }

  async getBenefitsByUserId(id: string) {
    const benefitsUser = await this.benefitUserService.getBenefitsByUserId(id);
    const benefits = [];
    for await (const benefitUser of benefitsUser) {
      benefits.push(
        await this.benefitRepository.findOne({
          where: { _id: new ObjectID(benefitUser.benefitId) },
        }),
      );
    }

    return benefits.map((x) => ({ ...x, points: Number(x.points) }));
  }
}
