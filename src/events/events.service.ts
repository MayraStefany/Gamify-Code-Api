import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterEvent, EditEvent } from './dto';
import { Event } from './event.entity,';
import {
  FORMAT_DATE,
  FORMAT_DATE_HOUR,
  PriorityPoints,
  sendEventNotification,
  validateEventSchedule,
} from './utilities';
import { ObjectID } from 'mongodb';
import * as moment from 'moment';
import { UserService } from 'src/user/user.service';
import { WeeksService } from '../weeks/weeks.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private userService: UserService,
    private weekService: WeeksService,
  ) {}

  public async getEventsSummary(userId: string) {
    const events = await this.eventRepository.find({
      where: {
        user: userId,
      },
    });

    const dateEvents = events.map((x) =>
      moment(x.startDate, FORMAT_DATE_HOUR).format(FORMAT_DATE),
    );

    const uniqueDates = Array.from(
      dateEvents.reduce(
        (prev, current) => prev.set(current, (prev.get(current) || 0) + 1),
        new Map(),
      ),
      ([date, count]) => ({ date, count }),
    );

    return {
      eventsDone: events.filter((x) => x.closed).length,
      eventsNoDone: events.filter((x) => !x.closed).length,
      datesDetail: uniqueDates,
      advance: Math.floor(
        (events.filter((x) => x.closed).length / events.length) * 100,
      ),
    };
  }

  public async findEventsByUserId(id: string) {
    const events = await this.eventRepository.find({
      where: {
        user: id,
      },
    });

    return events.map((x) => ({
      ...x,
      points: PriorityPoints.get(x.priority),
    }));
  }

  public async deleteEventById(id: string) {
    const found = await this.eventRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!found) throw new NotFoundException('Evento no encontrado.');
    return await this.eventRepository.delete(id);
  }

  public async updateById(
    id: string,
    dto: EditEvent,
    validateSchedule: boolean = false,
  ) {
    const found = await this.eventRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!found) throw new NotFoundException('Evento no encontrado.');

    if (!validateSchedule) return await this.eventRepository.update(id, dto);

    const weeks = await this.weekService.getWeeks();

    if (weeks.length === 0) {
      throw new HttpException({ message: 'No existen semanas.' }, 503);
    }

    const startCicle = weeks[0].start;
    const endCicle = weeks[weeks.length - 1].end;

    const events = await this.eventRepository.find({
      where: {
        user: found.user,
      },
    });

    if (
      !validateEventSchedule(
        {
          startDate: found.startDate,
          endDate: found.endDate,
          ...dto,
        },
        events.filter((x) => x._id.toString() !== id),
        startCicle,
        endCicle,
      )
    )
      throw new HttpException(
        {
          message: 'No se puede editar el evento dentro de este rango.',
        },
        503,
      );

    return await this.eventRepository.update(id, dto);
  }

  public async closeEventById(
    id: string,
    //  dto: CloseEvent
  ) {
    const found = await this.eventRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });
    if (!found) throw new NotFoundException('No existe el evento a cerrar.');

    //Close validate
    // const start = moment(found.endDate).diff(MINUTES_TO_CLOSE, 'minutes');
    // const end = found.endDate;
    // if (!moment(dto.time).isBetween(start, end))
    //   throw new HttpException(
    //     {
    //       message: 'Evento vencido o todavia no puedes cerrarlo.',
    //     },
    //     503,
    //   );

    //Update user points
    const { _id, points } = await this.userService.findUserById(found.user);
    await this.userService.updateUserById(_id, {
      points: (points ?? 0) + PriorityPoints.get(found.priority),
    });

    return await this.eventRepository.update(id, { closed: true });
  }

  public async addEvent(dto: RegisterEvent) {
    const weeks = await this.weekService.getWeeks();

    if (weeks.length === 0) {
      throw new HttpException({ message: 'No existen semanas.' }, 503);
    }

    const startCicle = weeks[0].start;
    const endCicle = weeks[weeks.length - 1].end;

    const userEvents = await this.eventRepository.find({
      where: {
        user: dto.user,
      },
    });

    if (!validateEventSchedule(dto, userEvents, startCicle, endCicle)) {
      throw new HttpException(
        { message: 'No puedes agregar un evento dentro de ese rango.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const event = this.eventRepository.create(dto);
    userEvents.push(await this.eventRepository.save(event));

    if (dto.repeat) {
      const weeks = await this.weekService.getWeeks();
      const fromDate = moment(dto.startDate, FORMAT_DATE_HOUR);
      const toDate = moment(weeks[weeks.length - 1].end, FORMAT_DATE_HOUR);
      const diff = toDate.diff(fromDate, 'days') + 1;
      for (let i = 0; i < diff; i = i + 7) {
        const event: RegisterEvent = {
          ...dto,
          startDate: moment(dto.startDate, FORMAT_DATE_HOUR)
            .add(i, 'days')
            .format(FORMAT_DATE_HOUR),
          endDate: moment(dto.endDate, FORMAT_DATE_HOUR)
            .add(i, 'days')
            .format(FORMAT_DATE_HOUR),
        };
        if (validateEventSchedule(event, userEvents, startCicle, endCicle)) {
          this.eventRepository.create(event);
          await this.eventRepository.save(event);
        }
      }
    }

    return true;
  }

  public async getEventById(id: string) {
    const found = await this.eventRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });
    if (!found) throw new NotFoundException('No existe el evento.');

    return {
      ...found,
      points: PriorityPoints.get(found.priority),
    };
  }

  public async sendNotifcation(id: string) {
    const event = await this.eventRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });

    if (!event) {
      throw new NotFoundException('Evento no existe.');
    }

    const user = await this.userService.findUserById(event.user);

    await sendEventNotification({
      token: user.token,
      title: 'Reunion entrante',
      body: `En 5 minutos comienza ${event.summary}`,
    });

    return true;
  }

  // private async updateMultipleEventsByEventsId(
  //   events: RegisterEvent[],
  //   userEventsToUse: Event[],
  // ) {
  //   for await (const event of events) {
  //     const eventToCompare = userEventsToUse.find(
  //       (x) => x.eventId === event.eventId,
  //     );

  //     const { priority, sent, closed, ...rest } = event;

  //     if (
  //       eventToCompare.startDate !== event.startDate ||
  //       eventToCompare.endDate !== event.endDate
  //     ) {
  //       //Validate again without that event
  //       if (
  //         validateEventSchedule(
  //           event,
  //           userEventsToUse.filter((x) => x.eventId !== event.eventId),
  //         )
  //       )
  //         this.updateEventByEventId(event.eventId, rest as RegisterEvent);
  //     } else {
  //       this.updateEventByEventId(event.eventId, rest as RegisterEvent);
  //     }
  //   }
  // }
}
