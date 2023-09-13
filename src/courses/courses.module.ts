import { Module, forwardRef } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesController } from './courses.controller';
import { WeeksModule } from 'src/weeks/weeks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), forwardRef(() => WeeksModule)],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
