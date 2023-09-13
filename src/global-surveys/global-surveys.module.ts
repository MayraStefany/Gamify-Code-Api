import { Module, forwardRef } from '@nestjs/common';
import { GlobalSurveysService } from './global-surveys.service';
import { GlobalSurveysController } from './global-surveys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSurvey } from './global-survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSurvey])],
  providers: [GlobalSurveysService],
  controllers: [GlobalSurveysController],
  exports: [GlobalSurveysService],
})
export class GlobalSurveysModule {}
