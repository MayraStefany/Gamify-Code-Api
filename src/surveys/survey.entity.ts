import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('surveys')
export class Survey {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ name: 'weekId' })
  weekId: string;

  @Column({ name: 'timeManagement' })
  timeManagement: number;

  @Column({ name: 'participation' })
  participation: number;
}
