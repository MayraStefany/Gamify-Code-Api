import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { CoursesService } from 'src/courses/courses.service';
import { UserService } from 'src/user/user.service';
import { RegisterGoal } from './dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    private courseService: CoursesService,
    private userService: UserService,
  ) {}

  async getAllGoalsByUserId(userId: string) {
    await this.userService.findUserById(userId);

    const goals = await this.goalRepository.find({
      where: { userId },
    });

    const response = [];

    for await (const goal of goals) {
      const { courseId, ...rest } = goal;
      const { records, ...courseRest } = await this.courseService.getCourseById(
        courseId,
      );

      response.push({
        ...rest,
        course: courseRest,
      });
    }

    return response;
  }

  async createGoal(dto: RegisterGoal) {
    const goal = this.goalRepository.create(dto);
    await this.goalRepository.save(goal);

    return { message: 'Objetivo registrado.' };
  }

  async getGoalById(id: string) {
    const goal = await this.goalRepository.findOne({
      where: { _id: new ObjectID(id) },
    });

    if (!goal) {
      throw new NotFoundException('Objetivo no encontrado.');
    }

    const { courseId, ...rest } = goal;
    const { records, ...courseRest } = await this.courseService.getCourseById(
      courseId,
    );

    return {
      ...rest,
      course: courseRest,
    };
  }

  async completeGoal(id: string) {
    await this.goalRepository.update(id, { complete: true });

    return { message: 'Objetivo completo.' };
  }
}
