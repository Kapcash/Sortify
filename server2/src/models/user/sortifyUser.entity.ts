import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class SortifyUser {

  @ObjectIdColumn()
  id!: string;

  @ObjectIdColumn({ name: 'id' })
  _id!: string;

  @Column('text')
  imageLink: string;

  @Column('text')
  displayName: string;

  @Column('text')
  accountType: string;

  @Column('text')
  href: string;
}
