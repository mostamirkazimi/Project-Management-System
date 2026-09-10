import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Team } from './team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column()
  teamId!: number;


  @Column()
  userId!: number;


  @ManyToOne(
    () => Team,
    team => team.members,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'teamId',
  })
  team!: Team;


  @ManyToOne(
    () => User,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user!: User;


  @CreateDateColumn()
  createdAt!: Date;
}