import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuyBenefit, RegisterBenefit } from './dto';
import { BenefitsService } from './benefits.service';
import { Trace } from 'easy-tracer';
import { Param } from '@nestjs/common';

@Controller('benefits')
export class BenefitsController {
  constructor(private benefitService: BenefitsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Trace()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RegisterBenefit,
  ) {
    await this.benefitService.createBenefit(file, dto);
    return { message: 'Beneficio creado' };
  }

  @Get()
  async getAllBenefits() {
    return await this.benefitService.getAllBenefits();
  }

  @Post('buy')
  @Trace()
  async buyBenefit(@Body() dto: BuyBenefit) {
    return await this.benefitService.buyBenefit(dto);
  }

  @Get('user/:id')
  async getBenefitsByUserId(@Param('id') id: string) {
    return await this.benefitService.getBenefitsByUserId(id);
  }
}
