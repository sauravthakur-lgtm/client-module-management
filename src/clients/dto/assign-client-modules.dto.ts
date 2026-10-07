import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';

export class AssignClientModulesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  moduleIds: string[];
}