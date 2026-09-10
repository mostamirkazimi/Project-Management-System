

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from '../../task/entities/task.entity';

import { Role } from '../enum/role.enum';


@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: false,
    type: 'varchar',
    length: 255,
  })
  firstName!: string;

  @Column({
    nullable: false,
    unique: false,
    type: 'varchar',
    length: 255,
  })
  lastName!: string;

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 255,
  })
  email!: string;

  @Column({
    nullable: false,
    unique: false,
    type: 'varchar',
    length: 255,
  })
  phone!: string;

  @Column({
    nullable: true,
    unique: false,
    type: 'varchar',
    length: 255,
  })
  address!: string;

  @Column({
    nullable: false,
    unique: false,
    type: 'varchar',
    length: 255,
  })
  city!: string;

  @Column({
    nullable: false,
    unique: false,
    type: 'varchar',
    length: 255,
    select:false,
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role!: Role;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 500,
  })
  profileImage!: string;

  @OneToMany(
  () => Task,
  task => task.assignedTo,
)
assignedTasks!: Task[];


@OneToMany(
  () => Task,
  task => task.createdBy,
)
createdTasks!: Task[];


  
}