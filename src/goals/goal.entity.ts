import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('goals')
export class Goal {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'courseId' })
  courseId: string;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'complete' })
  complete: boolean;
}
