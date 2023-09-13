import { Module, forwardRef } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity,';
import { UserModule } from 'src/user/user.module';
import { WeeksModule } from 'src/weeks/weeks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => UserModule),
    forwardRef(() => WeeksModule),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
