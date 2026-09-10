import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ProjectPriority,
  ProjectStatus,
} from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}