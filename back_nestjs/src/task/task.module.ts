import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Task,Project,User])],
  controllers: [TaskController],
  providers: [TasksService],
  exports:[TasksService],
})
export class TaskModule {}
