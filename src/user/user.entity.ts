import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'points' })
  points: number;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'isAdmin', nullable: true })
  isAdmin: boolean;

  @Column({ name: 'recoverCode', nullable: true })
  recoverCode: string;
}
