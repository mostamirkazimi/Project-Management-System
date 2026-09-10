import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Team } from './entities/team.entity';


import { CreateTeamDto } from './dto/create-team.dto';

import { UpdateTeamDto } from './dto/update-team.dto';
import { Project } from 'src/projects/entities/project.entity';
import { TeamMember } from './entities/team-member.entity';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class TeamService {

  constructor(

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

   @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  @InjectRepository(TeamMember)
  private readonly teamMemberRepository:Repository<TeamMember>

  ) {}


  // =========================
  // CREATE TEAM
  // =========================

  async create(
    createTeamDto: CreateTeamDto,
  ): Promise<Team> {

    const project =
      await this.projectRepository.findOne({
        where: {
          id: createTeamDto.projectId,
        },
      });


    if (!project) {

      throw new NotFoundException(
        'Project not found.',
      );

    }


    const team =
      this.teamRepository.create({
        name: createTeamDto.name,

        description:
          createTeamDto.description ?? null,

        projectId:
          createTeamDto.projectId,
      });


    return this.teamRepository.save(team);
  }

  async addMember(
  teamId: number,
  addTeamMemberDto: AddTeamMemberDto,
): Promise<TeamMember> {
  const team = await this.teamRepository.findOne({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new NotFoundException(
      'Team not found.',
    );
  }

  const user = await this.userRepository.findOne({
    where: {
      id: addTeamMemberDto.userId,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found.',
    );
  }

  const existingMember =
    await this.teamMemberRepository.findOne({
      where: {
        teamId,
        userId: addTeamMemberDto.userId,
      },
    });

  if (existingMember) {
    throw new ConflictException(
  'User is already a member of this team.',
);
  }

  const teamMember =
    this.teamMemberRepository.create({
      teamId,
      userId: addTeamMemberDto.userId,
    });

  return this.teamMemberRepository.save(
    teamMember,
  );
}


async getMembers(
  teamId: number,
): Promise<TeamMember[]> {
  const team = await this.teamRepository.findOne({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new NotFoundException(
      'Team not found.',
    );
  }

  return this.teamMemberRepository.find({
    where: {
      teamId,
    },
    relations: {
      user: true,
    },
    order: {
      createdAt: 'ASC',
    },
  });
}
  // =========================
  // FIND ALL TEAMS
  // =========================

 async findAll(): Promise<Team[]> {
  return this.teamRepository.find({
    relations: {
      project: true,
      members: {
        user: true,
      },
    },
    order: {
      createdAt: 'DESC',
    },
  });
}


  // =========================
  // FIND ONE TEAM
  // =========================

async findOne(
  id: number,
): Promise<Team> {
  const team =
    await this.teamRepository.findOne({
      where: {
        id,
      },
      relations: {
        project: true,
        members: {
          user: true,
        },
      },
    });

  if (!team) {
    throw new NotFoundException(
      'Team not found.',
    );
  }

  return team;
}


  // =========================
  // UPDATE TEAM
  // =========================

  async update(
    id: number,
    updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {

    const team =
      await this.teamRepository.findOne({
        where: {
          id,
        },
      });


    if (!team) {

      throw new NotFoundException(
        'Team not found.',
      );

    }


    if (
      updateTeamDto.projectId !== undefined
    ) {

      const project =
        await this.projectRepository.findOne({

          where: {
            id: updateTeamDto.projectId,
          },

        });


      if (!project) {

        throw new NotFoundException(
          'Project not found.',
        );

      }

    }


    Object.assign(
      team,
      updateTeamDto,
    );


    await this.teamRepository.save(team);


    return this.findOne(id);
  }


  // =========================
  // DELETE TEAM
  // =========================

  async remove(
    id: number,
  ): Promise<{
    message: string;
  }> {

    const team =
      await this.teamRepository.findOne({
        where: {
          id,
        },
      });


    if (!team) {

      throw new NotFoundException(
        'Team not found.',
      );

    }


    await this.teamRepository.remove(team);


    return {
      message: 'Team deleted successfully.',
    };
  }

  async removeMember(
  teamId: number,
  userId: number,
): Promise<{ message: string }> {
  const member =
    await this.teamMemberRepository.findOne({
      where: {
        teamId,
        userId,
      },
    });

  if (!member) {
    throw new NotFoundException(
      'Team member not found.',
    );
  }

  await this.teamMemberRepository.remove(
    member,
  );

  return {
    message: 'Team member removed successfully.',
  };
}

}