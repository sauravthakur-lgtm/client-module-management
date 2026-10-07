import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';

export class AssignRoleModulesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  moduleIds: string[];
}