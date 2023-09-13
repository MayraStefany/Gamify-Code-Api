import { Controller, Get, Body, Post } from '@nestjs/common';
import { WeeksService } from './weeks.service';
import { RegisterWeek } from './dtos';
import { Trace } from 'easy-tracer';

@Controller('weeks')
export class WeeksController {
  constructor(private weekService: WeeksService) {}

  @Get()
  @Trace()
  async getWeeks() {
    return await this.weekService.getWeeks();
  }

  @Post()
  @Trace()
  async registerWeeks(@Body() dto: RegisterWeek) {
    return await this.weekService.registerWeeks(dto);
  }
}
