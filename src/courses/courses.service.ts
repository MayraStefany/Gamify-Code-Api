import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { RegisterCourses } from './dto/register-course';
import { WeeksService } from 'src/weeks/weeks.service';
import { ObjectID } from 'mongodb';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private weekService: WeeksService,
  ) {}

  async getCourses() {
    return await this.courseRepository.find({});
  }

  async registerCourses(dto: RegisterCourses) {
    const response = [];
    for await (const course of dto.courses) {
      for await (const record of course.records) {
        const weekFound = await this.weekService.getWeekById(record.weekId);
        record.weekName = `Semana ${weekFound.number}`;
      }
      const courseToRegister = this.courseRepository.create(course);
      response.push(await this.courseRepository.save(courseToRegister));
    }

    return response;
  }

  async getCourseById(id: string) {
    const course = await this.courseRepository.findOne({
      where: { _id: new ObjectID(id) },
    });

    if (!course) {
      throw new NotFoundException('No existe el curso.');
    }

    return course;
  }
}
