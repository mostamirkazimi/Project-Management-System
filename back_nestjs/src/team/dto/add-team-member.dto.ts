import {
  IsInt,
  Min,
} from 'class-validator';

export class AddTeamMemberDto {
  @IsInt()
  @Min(1)
  userId!: number;
}