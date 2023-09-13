import { Module } from '@nestjs/common';
import { WeeksService } from './weeks.service';
import { WeeksController } from './weeks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Week } from './week.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Week])],
  providers: [WeeksService],
  controllers: [WeeksController],
  exports: [WeeksService],
})
export class WeeksModule {}
