import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'records' })
  records: CourseRecord[];
}

interface CourseRecord {
  weekId: string;
  topics: string[];
}
