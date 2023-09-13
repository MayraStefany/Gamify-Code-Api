import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('weeks')
export class Week {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'number' })
  number: number;

  @Column({ name: 'start' })
  start: string;

  @Column({ name: 'end' })
  end: string;
}
