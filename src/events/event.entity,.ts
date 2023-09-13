import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Priority } from './enum';
import { ObjectID } from 'mongodb';

@Entity('events')
export class Event {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'summary' })
  summary: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'startDate' })
  startDate: string;

  @Column({ name: 'endDate' })
  endDate: string;

  @Column({ name: 'priority' })
  priority: Priority;

  @Column({ name: 'user' })
  user: ObjectID;

  @Column({ name: 'tokenInherited', nullable: true })
  tokenInherited: string;

  @Column({ name: 'sent' })
  sent: boolean;

  @Column({ name: 'closed' })
  closed: boolean;
}
