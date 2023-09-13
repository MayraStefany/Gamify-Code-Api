import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { EasyTracerModule } from 'easy-tracer';
import { WeeksModule } from './weeks/weeks.module';
import { CoursesModule } from './courses/courses.module';
import { SurveysModule } from './surveys/surveys.module';
import { GlobalSurveysModule } from './global-surveys/global-surveys.module';
import { GlobalConfigModule } from './global-config/global-config.module';
import { BenefitsModule } from './benefits/benefits.module';
import { BenefitUserModule } from './benefit-user/benefit-user.module';
import { GoalsModule } from './goals/goals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      // host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + './**/**/*entity{.ts,.js}'],
      autoLoadEntities: true,
      authSource: 'admin',
      synchronize: true,
      url: process.env.URI
      // ssl: process.env.SSL === 'true',
    }),
    EasyTracerModule.forRoot({
      showLogs: true,
    }),
    UserModule,
    EventsModule,
    WeeksModule,
    CoursesModule,
    SurveysModule,
    GlobalSurveysModule,
    GlobalConfigModule,
    BenefitsModule,
    BenefitUserModule,
    GoalsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
