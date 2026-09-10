import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Team,TeamMember,Project,User])],
  controllers: [TeamController],
  providers: [TeamService],
  exports:[TeamService],
})
export class TeamModule {}
