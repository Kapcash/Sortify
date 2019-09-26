import { Entity, Column, ObjectIdColumn, PrimaryColumn, ObjectID } from 'typeorm';

@Entity('users')
export class SortifyUser {

  @ObjectIdColumn({name: '_id'})
  id: string;

  @Column('text')
  imageLink: string;

  @Column('text')
  displayName: string;

  @Column('text')
  accountType: string;

  @Column('text')
  href: string;
}
