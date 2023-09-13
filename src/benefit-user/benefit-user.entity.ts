import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('benefit-users')
export class BenefitUser {
  @ObjectIdColumn()
  _id: string;

  @Column({ name: 'benefitId' })
  benefitId: string;

  @Column({ name: 'userId' })
  userId: string;
}
