import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('benefits')
export class Benefit {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'points' })
  points: number;

  @Column({ name: 'file' })
  file: string;

  @Column({ name: 'extension' })
  extension: string;

  @Column({ name: 'type' })
  type: string;
}
