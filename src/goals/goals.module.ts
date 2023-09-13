import { Module, forwardRef } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { UserModule } from 'src/user/user.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal]),
    forwardRef(() => UserModule),
    forwardRef(() => CoursesModule),
  ],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
