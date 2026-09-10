import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Post(':id/members')
addMember(
  @Param('id') id: string,
  @Body() addTeamMemberDto: AddTeamMemberDto,
) {
  return this.teamService.addMember(
    +id,
    addTeamMemberDto,
  );
}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id/members')
getMembers(@Param('id') id: string) {
  return this.teamService.getMembers(+id);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id/members/:userId')
removeMember(
  @Param('id') id: string,
  @Param('userId') userId: string,
) {
  return this.teamService.removeMember(
    +id,
    +userId,
  );
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
