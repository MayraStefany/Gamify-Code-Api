import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Week } from './week.entity';
import { Repository } from 'typeorm';
import { RegisterWeek } from './dtos';
import { ObjectID } from 'mongodb';

@Injectable()
export class WeeksService {
  constructor(
    @InjectRepository(Week)
    private weekRepository: Repository<Week>,
  ) {}

  async getWeeks() {
    return await this.weekRepository.find({});
  }

  async registerWeeks(dto: RegisterWeek) {
    const response = [];
    for await (const week of dto.weeks) {
      const weekToRegister = this.weekRepository.create(week);
      response.push(await this.weekRepository.save(weekToRegister));
    }

    return response;
  }

  async getWeekById(id: string) {
    const found = await this.weekRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!found)
      throw new HttpException({ message: 'Semana no encontrada' }, 503);

    return found;
  }
}
