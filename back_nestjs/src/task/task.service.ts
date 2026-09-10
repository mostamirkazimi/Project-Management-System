
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { TaskQueryDto } from './dto/task-query.dto';


@Injectable()
export class TasksService {

  constructor(

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}


  // =========================
  // CREATE TASK
  // =========================

  async create(
    createTaskDto: CreateTaskDto,
    createdById: number,
  ): Promise<Task> {

    // Check Project

    const project = await this.projectRepository.findOne({
      where: {
        id: createTaskDto.projectId,
      },
    });

    if (!project) {

      throw new NotFoundException(
        `Project with id ${createTaskDto.projectId} not found`,
      );

    }


    // Check Assigned User

    let assignedTo: User | null = null;

    if (createTaskDto.assignedToId) {

      assignedTo = await this.userRepository.findOne({
        where: {
          id: createTaskDto.assignedToId,
        },
      });

      if (!assignedTo) {

        throw new NotFoundException(
          `User with id ${createTaskDto.assignedToId} not found`,
        );

      }

    }


    // Check Creator

    const createdBy = await this.userRepository.findOne({
      where: {
        id: createdById,
      },
    });

    if (!createdBy) {

      throw new NotFoundException(
        `Creator with id ${createdById} not found`,
      );

    }


    // Create Task

    const task = this.taskRepository.create({

      title: createTaskDto.title,

      description:
        createTaskDto.description ?? null,

      status:
        createTaskDto.status,

      priority:
        createTaskDto.priority,

      dueDate:
        createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : null,

      projectId:
        project.id,

      project,

      assignedToId:
        assignedTo?.id ?? null,

      assignedTo,

      createdById:
        createdBy.id,

      createdBy,

    });


    return await this.taskRepository.save(task);

  }

 
// =========================
// FIND ALL TASKS
// SEARCH + FILTER + PAGINATION
// =========================

async findAll(
  query: TaskQueryDto,
) {

  const {
    search,
    status,
    priority,
    projectId,
    page = 1,
    limit = 10,
  } = query;


  // =========================
  // QUERY BUILDER
  // =========================

  const queryBuilder =
    this.taskRepository
      .createQueryBuilder('task')

      .leftJoinAndSelect(
        'task.project',
        'project',
      )

      .leftJoinAndSelect(
        'task.assignedTo',
        'assignedTo',
      )

      .leftJoinAndSelect(
        'task.createdBy',
        'createdBy',
      );


  // =========================
  // SEARCH
  // =========================

  if (search) {

    queryBuilder.andWhere(
      `(
        task.title ILIKE :search
        OR task.description ILIKE :search
      )`,
      {
        search: `%${search}%`,
      },
    );

  }


  // =========================
  // STATUS FILTER
  // =========================

  if (status) {

    queryBuilder.andWhere(
      'task.status = :status',
      {
        status,
      },
    );

  }


  // =========================
  // PRIORITY FILTER
  // =========================

  if (priority) {

    queryBuilder.andWhere(
      'task.priority = :priority',
      {
        priority,
      },
    );

  }


  // =========================
  // PROJECT FILTER
  // =========================

  if (projectId) {

    queryBuilder.andWhere(
      'task.projectId = :projectId',
      {
        projectId,
      },
    );

  }


  // =========================
  // PAGINATION
  // =========================

  const skip =
    (page - 1) * limit;


  queryBuilder
    .skip(skip)
    .take(limit);


  // =========================
  // ORDER
  // =========================

  queryBuilder.orderBy(
    'task.createdAt',
    'DESC',
  );


  // =========================
  // EXECUTE
  // =========================

  const [
    data,
    total,
  ] = await queryBuilder.getManyAndCount();


  // =========================
  // RESPONSE
  // =========================

  return {

    data,

    total,

    page,

    limit,

    totalPages:
      Math.ceil(total / limit),

  };

}


// =========================
// FIND MY TASKS
// =========================

async findMyTasks(
  userId: number,
): Promise<Task[]> {

  return await this.taskRepository.find({

    where: [
      {
        assignedToId: userId,
      },
      {
        createdById: userId,
      },
    ],

    relations: {
      project: true,
      assignedTo: true,
      createdBy: true,
    },

    order: {
      createdAt: 'DESC',
    },

  });

}


// =========================
// FIND TASKS BY PROJECT
// =========================

async findByProject(
  projectId: number,
): Promise<Task[]> {

  // =========================
  // CHECK PROJECT
  // =========================

  const project =
    await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
    });

  if (!project) {

    throw new NotFoundException(
      `Project with id ${projectId} not found`,
    );

  }


  // =========================
  // FIND TASKS
  // =========================

  return await this.taskRepository.find({

    where: {
      projectId,
    },

    relations: {
      project: true,
      assignedTo: true,
      createdBy: true,
    },

    order: {
      createdAt: 'DESC',
    },

  });

}








  // =========================
  // FIND ONE TASK
  // =========================

  async findOne(id: number): Promise<Task> {

    const task =
      await this.taskRepository.findOne({

        where: {
          id,
        },

        relations: {
          project: true,
          assignedTo: true,
          createdBy: true,
        },

      });


    if (!task) {

      throw new NotFoundException(
        `Task with id ${id} not found`,
      );

    }


    return task;

  }


  
async update(
  id: number,
  updateTaskDto: UpdateTaskDto,
  currentUserId: number,
  currentUserRole: string,
): Promise<Task> {

  const task = await this.findOne(id);


  // =========================
  // AUTHORIZATION
  // =========================

  const isAdmin =
    currentUserRole === 'admin';

  const isCreator =
    task.createdById === currentUserId;

  const isAssignedUser =
    task.assignedToId === currentUserId;


  if (
    !isAdmin &&
    !isCreator &&
    !isAssignedUser
  ) {

    throw new ForbiddenException(
      'You do not have permission to update this task',
    );

  }


  // =========================
  // CHECK PROJECT
  // =========================

  if (
    updateTaskDto.projectId !== undefined
  ) {

    const project =
      await this.projectRepository.findOne({

        where: {
          id: updateTaskDto.projectId,
        },

      });


    if (!project) {

      throw new NotFoundException(
        `Project with id ${updateTaskDto.projectId} not found`,
      );

    }


    task.project = project;

    task.projectId = project.id;

  }


  // =========================
  // CHECK ASSIGNED USER
  // =========================

  if (
    updateTaskDto.assignedToId !== undefined
  ) {

    if (
      updateTaskDto.assignedToId === null
    ) {

      task.assignedTo = null;

      task.assignedToId = null;

    } else {

      const user =
        await this.userRepository.findOne({

          where: {
            id: updateTaskDto.assignedToId,
          },

        });


      if (!user) {

        throw new NotFoundException(
          `User with id ${updateTaskDto.assignedToId} not found`,
        );

      }


      task.assignedTo = user;

      task.assignedToId = user.id;

    }

  }


  // =========================
  // BASIC FIELDS
  // =========================

  if (
    updateTaskDto.title !== undefined
  ) {

    task.title =
      updateTaskDto.title;

  }


  if (
    updateTaskDto.description !== undefined
  ) {

    task.description =
      updateTaskDto.description;

  }


  if (
    updateTaskDto.status !== undefined
  ) {

    task.status =
      updateTaskDto.status;

  }


  if (
    updateTaskDto.priority !== undefined
  ) {

    task.priority =
      updateTaskDto.priority;

  }


  if (
    updateTaskDto.dueDate !== undefined
  ) {

    task.dueDate =
      updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : null;

  }


  return await this.taskRepository.save(task);
}




  
async remove(
  id: number,
  currentUserId: number,
  currentUserRole: string,
): Promise<{ message: string }> {

  const task = await this.findOne(id);


  // =========================
  // AUTHORIZATION
  // =========================

  const isAdmin =
    currentUserRole === 'admin';

  const isCreator =
    task.createdById === currentUserId;


  if (
    !isAdmin &&
    !isCreator
  ) {

    throw new ForbiddenException(
      'You do not have permission to delete this task',
    );

  }


  // =========================
  // DELETE
  // =========================

  await this.taskRepository.remove(task);


  return {

    message:
      'Task deleted successfully',

  };
}



}

