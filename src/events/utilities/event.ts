import { EditEvent, RegisterEvent } from '../dto';
import { Priority } from '../enum';
import * as moment from 'moment';
import { Event } from '../event.entity,';
import axios from 'axios';
import { Body } from '@nestjs/common';

export const MINUTES_TO_CLOSE = 5;

export const PriorityPoints = new Map<Priority, number>([
  [Priority.High, 30],
  [Priority.Medium, 20],
  [Priority.Low, 10],
]);

export type EventType = RegisterEvent | EditEvent;

export const FORMAT_DATE_HOUR = 'YYYY-MM-DD HH:mm:ss';

export const FORMAT_DATE = 'YYYY-MM-DD';

export const validateEventSchedule = (
  event: EventType,
  userEvents: Event[],
  startCicle: string,
  endCicle: string,
) => {
  //Validate events
  const startDate = moment(event.startDate, FORMAT_DATE_HOUR);
  const endDate = moment(event.endDate, FORMAT_DATE_HOUR);

  //Validate if event is inside cicle
  const compareStartCicle = moment(startCicle, FORMAT_DATE_HOUR);
  const compareEndCicle = moment(endCicle, FORMAT_DATE_HOUR);

  if (startDate >= endDate) return false;

  if (
    !startDate.isBetween(compareStartCicle, compareEndCicle) ||
    !endDate.isBetween(compareStartCicle, compareEndCicle)
  ) {
    return false;
  }

  return !userEvents.some((x) => {
    const compareStart = moment(x.startDate, FORMAT_DATE_HOUR);
    const compareEnd = moment(x.endDate, FORMAT_DATE_HOUR);

    return (
      compareStart.isBetween(startDate, endDate) ||
      compareEnd.isBetween(startDate, endDate) ||
      startDate.isBetween(compareStart, compareEnd) ||
      endDate.isBetween(compareStart, compareEnd) ||
      (startDate.isSame(compareStart) && endDate.isSame(compareEnd)) ||
      startDate.isSame(endDate)
    );
  });
};

export const getDatesInsideRange = (
  startDate: string,
  endDate: string,
): moment.Moment[] => {
  let fromDate = moment(startDate);
  let toDate = moment(endDate);
  let diff = toDate.diff(fromDate, 'days') + 1;
  let range = [];
  for (let i = 0; i < diff; i++) {
    range.push(moment(startDate).add(i, 'days'));
  }
  return range;
};

export const sendEventNotification = async (message: {
  token: string;
  title: string;
  body: string;
}) => {
  try {
    await axios
      .post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: message.token,
          content_available: true,
          mutable_content: true,
          data: {
            title: message.title,
            body: message.body,
          },
          notification: {
            title: message.title,
            body: message.body,
            mutable_content: true,
            sound: 'Tri-tone',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'key=AAAAMgHU_us:APA91bFk8lrNM59sQCPJWMnqNsE9-TyuijiqFofPwEw2saF6U-1seKieUr43CIb1KqdN-OHuhWuFODSFSeOc4gqleB98pSR1hlH1-s8sJYTW7CH4ZajpFG-WdP-DGHlh52y776q0RvI9',
          },
        },
      )
      .catch((err) => {
        console.log('Error al enviar al token', err);
      });
  } catch (error) {
    console.log('ERROR', error);
  }
};
