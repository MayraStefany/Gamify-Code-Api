import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { RegisterSurvey } from './dto';
import { Trace } from 'easy-tracer';

@Controller('surveys')
export class SurveysController {
  constructor(private surveyService: SurveysService) {}

  @Get('user/:id')
  @Trace()
  async getSurveysDoneByUserId(@Param('id') id: string) {
    return await this.surveyService.getSurveysByUser(id);
  }

  @Post()
  @Trace()
  async createSurvey(@Body() dto: RegisterSurvey) {
    return await this.surveyService.registerSurvey(dto);
  }

  @Get('user/:id/summary')
  @Trace()
  async getSummaryByUserId(@Param('id') id: string) {
    return await this.surveyService.getSummaryByUserId(id);
  }
}
