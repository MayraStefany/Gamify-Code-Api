import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSurvey } from './global-survey.entity';
import { Repository } from 'typeorm';
import { RegisterGlobalSurvey } from './dto';

@Injectable()
export class GlobalSurveysService {
  constructor(
    @InjectRepository(GlobalSurvey)
    private globalSurveyRepository: Repository<GlobalSurvey>,
  ) {}

  async getAllGlobalSurveys() {
    return await this.globalSurveyRepository.find({});
  }

  async createGlobalSurvey(dto: RegisterGlobalSurvey) {
    const found = await this.globalSurveyRepository.findOne({
      where: { userId: dto.userId },
    });
    if (found)
      throw new HttpException({ message: 'Ya se realizo esta encuesta.' }, 503);
    const globalSurveyToRegister = this.globalSurveyRepository.create(dto);
    return await this.globalSurveyRepository.save(globalSurveyToRegister);
  }

  async validateSurveyExits(userId: string) {
    return await this.globalSurveyRepository.findOne({
      where: { userId },
    });
  }
}
