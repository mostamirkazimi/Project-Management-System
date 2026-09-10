
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { TasksService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TaskQueryDto } from './dto/task-query.dto';




@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {

  constructor(
    private readonly taskService: TasksService,
  ) {}


  // =========================
  // CREATE TASK
  // =========================

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any,
  ) {

    const user = req.user as {
      userId: number;
      email: string;
      role: string;
    };

    return this.taskService.create(
      createTaskDto,
      user.userId,
    );
  }


  // =========================
  // GET ALL TASKS
  // =========================

  
 
@Get()
findAll(
  @Query() query: TaskQueryDto,
) {

  return this.taskService.findAll(
    query,
  );

}



@Get('my-tasks')
@UseGuards(JwtAuthGuard)
findMyTasks(
  @Req() req: any,
) {
  return this.taskService.findMyTasks(
    req.user.userId,
  );
}

@Get('project/:projectId')
@UseGuards(JwtAuthGuard)
findByProject(
  @Param('projectId') projectId: string,
) {
  return this.taskService.findByProject(
    +projectId,
  );
}



  // =========================
  // GET ONE TASK
  // =========================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    return this.taskService.findOne(id);

  }


// =========================
// UPDATE TASK
// =========================

@Patch(':id')
update(
  @Param('id', ParseIntPipe)
  id: number,

  @Body()
  updateTaskDto: UpdateTaskDto,

  @Req()
  req: any,
) {

  const user = req.user as {
    userId: number;
    email: string;
    role: string;
  };

  return this.taskService.update(
    id,
    updateTaskDto,
    user.userId,
    user.role,
  );
}


// =========================
// DELETE TASK
// =========================

@Delete(':id')
remove(
  @Param('id', ParseIntPipe)
  id: number,

  @Req()
  req: any,
) {

  const user = req.user as {
    userId: number;
    email: string;
    role: string;
  };

  return this.taskService.remove(
    id,
    user.userId,
    user.role,
  );
}


}

