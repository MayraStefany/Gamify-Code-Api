import { Module, forwardRef } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfigController } from './global-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from './global-config.entity';
import { WeeksModule } from 'src/weeks/weeks.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalConfig]),
    forwardRef(() => WeeksModule),
    forwardRef(() => UserModule),
  ],
  providers: [GlobalConfigService],
  controllers: [GlobalConfigController],
})
export class GlobalConfigModule {}
