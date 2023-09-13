import { Module, forwardRef } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { WeeksModule } from 'src/weeks/weeks.module';
import { UserModule } from 'src/user/user.module';
import { GlobalSurveysModule } from 'src/global-surveys/global-surveys.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey]),
    forwardRef(() => WeeksModule),
    forwardRef(() => UserModule),
    forwardRef(() => GlobalSurveysModule),
    forwardRef(() => SurveysModule),
    forwardRef(() => EventsModule),
  ],
  providers: [SurveysService],
  controllers: [SurveysController],
  exports: [SurveysService],
})
export class SurveysModule {}
