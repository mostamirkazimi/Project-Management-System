
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';


export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}


export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}


@Entity('tasks')
export class Task {

  // =========================
  // ID
  // =========================

  @PrimaryGeneratedColumn()
  id!: number;


  // =========================
  // TITLE
  // =========================

  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;


  // =========================
  // DESCRIPTION
  // =========================

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;


  // =========================
  // STATUS
  // =========================

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;


  // =========================
  // PRIORITY
  // =========================

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;


  // =========================
  // DUE DATE
  // =========================

  @Column({
    type: 'date',
    nullable: true,
  })
  dueDate!: Date | null;


  // =========================
  // PROJECT
  // =========================

  @Column()
  projectId!: number;

  @ManyToOne(
    () => Project,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'projectId',
  })
  project!: Project;


  // =========================
  // ASSIGNED USER
  // =========================

  @Column({
    nullable: true,
  })
  assignedToId!: number | null;

  @ManyToOne(
    () => User,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({
    name: 'assignedToId',
  })
  assignedTo!: User | null;


  // =========================
  // CREATED BY
  // =========================

  @Column()
  createdById!: number;

  @ManyToOne(
    () => User,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'createdById',
  })
  createdBy!: User;


  // =========================
  // CREATED AT
  // =========================

  @CreateDateColumn()
  createdAt!: Date;


  // =========================
  // UPDATED AT
  // =========================

  @UpdateDateColumn()
  updatedAt!: Date;
}

