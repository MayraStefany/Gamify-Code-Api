import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('global-config')
export class GlobalConfig {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'week' })
  week: string;
}
