import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

export enum ProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PLANNING,
    })
    status!: ProjectStatus;

    @Column({ type: 'varchar', length: 500, nullable: true })
    image!: string | null

    @Column({
        type: 'enum',
        enum: ProjectPriority,
        default: ProjectPriority.MEDIUM,
    })
    priority!: ProjectPriority;

    @Column({ type: 'date', nullable: true })
    startDate!: Date;

    @Column({ type: 'date', nullable: true })
    dueDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(
  () => Task,
  task => task.project,
)
tasks!: Task[];
}