import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';


export class CreateTeamDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsInt()
  @Min(1)
  projectId!: number;
}