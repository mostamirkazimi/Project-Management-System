import { IsEnum } from 'class-validator';
import { Role } from '../enum/role.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  role!: Role;
}