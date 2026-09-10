import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TeamMember } from './team-member.entity';
import { Project } from 'src/projects/entities/project.entity';


@Entity('teams')
export class Team {

  @PrimaryGeneratedColumn()
  id!: number;


  @Column({
    type: 'varchar',
    length: 255,
  })
  name!: string;


  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;


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


  @OneToMany(
    () => TeamMember,
    teamMember => teamMember.team,
  )
  members!: TeamMember[];


  @CreateDateColumn()
  createdAt!: Date;


  @UpdateDateColumn()
  updatedAt!: Date;
}