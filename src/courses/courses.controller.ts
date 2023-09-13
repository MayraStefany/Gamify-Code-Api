import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RegisterCourses } from './dto';
import { Trace } from 'easy-tracer';

@Controller('courses')
export class CoursesController {
  constructor(private coursesSerive: CoursesService) {}

  @Get()
  @Trace()
  async getCourses() {
    return await this.coursesSerive.getCourses();
  }

  @Post()
  @Trace()
  async createCourses(@Body() dto: RegisterCourses) {
    return await this.coursesSerive.registerCourses(dto);
  }
}
