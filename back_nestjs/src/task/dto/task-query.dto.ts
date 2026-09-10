
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  TaskPriority,
  TaskStatus,
} from '../entities/task.entity';


export class TaskQueryDto {

  // =========================
  // SEARCH
  // =========================

  @IsOptional()
  @IsString()
  search?: string;


  // =========================
  // STATUS
  // =========================

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;


  // =========================
  // PRIORITY
  // =========================

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;


  // =========================
  // PROJECT ID
  // =========================

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  projectId?: number;


  // =========================
  // PAGE
  // =========================

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;


  // =========================
  // LIMIT
  // =========================

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

}

