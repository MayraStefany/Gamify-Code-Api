import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { Repository } from 'typeorm';
import { RegisterSurvey } from './dto';
import { WeeksService } from 'src/weeks/weeks.service';
import { UserService } from 'src/user/user.service';
import { GlobalSurveysService } from 'src/global-surveys/global-surveys.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    private weekService: WeeksService,
    private userService: UserService,
    private globalSurveyService: GlobalSurveysService,
    private eventService: EventsService,
  ) {}

  private getAverage(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  async getSummaryByUserId(userId: string) {
    await this.userService.findUserById(userId);
    const globalSurvey = await this.globalSurveyService.validateSurveyExits(
      userId,
    );

    if (!globalSurvey) {
      throw new NotFoundException('No existe encuesta para este usuario');
    }

    const userSurveys = await this.surveyRepository.find({ where: { userId } });
    const userEvents = await this.eventService.findEventsByUserId(userId);

    return {
      eventsDone: userEvents.filter(({ closed }) => closed === true).length,
      taskCompletion: {
        before: globalSurvey.taskCompletion,
        after: userEvents.filter(({ closed }) => closed === true).length,
      },
      timeManagement: {
        before: globalSurvey.timeManagement,
        after: this.getAverage(userSurveys.map((x) => x.timeManagement)),
      },
      participation: {
        before: globalSurvey.participation,
        after: this.getAverage(userSurveys.map((x) => x.participation)),
      },
    };
  }

  async getSurveysByUser(id: string) {
    const surveys = await this.surveyRepository.find({ where: { userId: id } });
    return surveys;
  }

  async registerSurvey(dto: RegisterSurvey) {
    await this.weekService.getWeekById(dto.weekId);
    const found = await this.surveyRepository.findOne({
      where: {
        userId: dto.userId,
        weekId: dto.weekId,
      },
    });
    if (found)
      throw new HttpException(
        { message: 'Ya existe una encuesta en esa semana.' },
        503,
      );
    const surveyToRegister = this.surveyRepository.create(dto);
    return await this.surveyRepository.save(surveyToRegister);
  }
}
