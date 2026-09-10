import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { BlogStatus } from '../enum/blog-status.enum';

export class CreateBlogDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  image?: string;

  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
 
  
  @IsInt()
  @IsNotEmpty()
  authorId!: number;
}