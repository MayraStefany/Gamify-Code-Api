import { Controller, Get, Post, Body } from '@nestjs/common';
import { GlobalSurveysService } from './global-surveys.service';
import { RegisterGlobalSurvey } from './dto';
import { Trace } from 'easy-tracer';

@Controller('global-surveys')
export class GlobalSurveysController {
  constructor(private globalSurveyService: GlobalSurveysService) {}

  @Get()
  @Trace()
  async getAllGlobalSurveys() {
    return await this.globalSurveyService.getAllGlobalSurveys();
  }

  @Post()
  @Trace()
  async registerGlobalSurvey(@Body() dto: RegisterGlobalSurvey) {
    return await this.globalSurveyService.createGlobalSurvey(dto);
  }
}
