import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('global-surveys')
export class GlobalSurvey {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ name: 'participation' })
  participation: number;

  @Column({ name: 'taskCompletion' })
  taskCompletion: number;

  @Column({ name: 'timeManagement' })
  timeManagement: number;
}
