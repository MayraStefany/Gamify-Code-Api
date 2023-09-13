import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'message' })
  message: string;
}
