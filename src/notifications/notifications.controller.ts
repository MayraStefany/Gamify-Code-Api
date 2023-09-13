import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RegisterNotification } from './dto';
import { Trace } from 'easy-tracer';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Post()
  @Trace()
  async createNotification(@Body() dto: RegisterNotification) {
    await this.notificationService.createNotification(dto);
    return { message: 'Notification creada y enviada.' };
  }

  @Get()
  @Trace()
  async getAllNotifications() {
    return await this.notificationService.getAllNotifications();
  }
}
