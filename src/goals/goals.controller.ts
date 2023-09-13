import { Controller, Get, Param, Body, Post, Put } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Trace } from 'easy-tracer';
import { RegisterGoal } from './dto';

@Controller('goals')
export class GoalsController {
  constructor(private goalService: GoalsService) {}

  @Get(':id')
  @Trace()
  async getGoalById(@Param('id') id: string) {
    return await this.goalService.getGoalById(id);
  }

  @Post()
  @Trace()
  async createGoal(@Body() dto: RegisterGoal) {
    return await this.goalService.createGoal(dto);
  }

  @Put(':id/complete')
  @Trace()
  async completeGoal(@Param('id') id: string) {
    return await this.goalService.completeGoal(id);
  }

  @Get('user/:id')
  @Trace()
  async getGoalsByUserId(@Param('id') id: string) {
    return await this.goalService.getAllGoalsByUserId(id);
  }
}
