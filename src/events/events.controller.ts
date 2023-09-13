import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RegisterEvent, EditEvent } from './dto';
import { EventsService } from './events.service';
import { CloseEvent } from './dto/close-event';
import { Trace } from 'easy-tracer';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Get('/user/:id')
  @Trace()
  async getEventsByUserId(@Param('id') id: string) {
    return await this.eventService.findEventsByUserId(id);
  }

  @Post()
  @Trace()
  async addEvent(@Body() dto: RegisterEvent) {
    await this.eventService.addEvent(dto);
    return { message: 'Event was added' };
  }

  @Delete(':id')
  @Trace()
  async deleteEventById(@Param('id') id: string) {
    return await this.eventService.deleteEventById(id);
  }

  @Put(':id')
  @Trace()
  async updateEventById(@Param('id') id: string, @Body() dto: EditEvent) {
    return await this.eventService.updateById(
      id,
      dto,
      Boolean(dto?.startDate || dto?.endDate),
    );
  }

  @Put(':id/close')
  @Trace()
  async closeEventId(
    @Param('id') id: string,
    //  @Body() dto: CloseEvent
  ) {
    return await this.eventService.closeEventById(id);
  }

  @Get(':id')
  @Trace()
  async getEventById(@Param('id') id: string) {
    return await this.eventService.getEventById(id);
  }

  @Get('/user/:id/summary')
  @Trace()
  async getEventsSummary(@Param('id') id: string) {
    return await this.eventService.getEventsSummary(id);
  }

  @Post(':id/send-notification')
  @Trace()
  async sendEventNotification(@Param('id') id: string) {
    await this.eventService.sendNotifcation(id);
    return { message: 'Notification was sent.' };
  }
}
