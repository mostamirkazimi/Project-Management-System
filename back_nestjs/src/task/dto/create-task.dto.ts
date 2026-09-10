import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  TaskPriority,
  TaskStatus,
} from '../entities/task.entity';

export class CreateTaskDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title!: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;


  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;


  @IsOptional()
  @IsDateString()
  dueDate?: string;


  @IsInt()
  projectId!: number;


  @IsOptional()
  @IsInt()
  assignedToId?: number | null;
}