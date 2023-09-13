import { Controller, Get, Put, Body } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { Trace } from 'easy-tracer';

@Controller('global-config')
export class GlobalConfigController {
  constructor(private globalConfigService: GlobalConfigService) {}

  @Get()
  @Trace()
  async getGlobalConfig() {
    return await this.globalConfigService.getGlobalConfig();
  }

  @Put('update-week')
  @Trace()
  async updateWeek(@Body() dto: { date: string }) {
    return await this.globalConfigService.changeWeek(dto.date);
  }
}
