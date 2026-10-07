import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleModulesDto {
  @ApiProperty({
    description: 'List of module IDs to assign to the role',
    example: [
      '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
      '123e4567-e89b-42d3-a456-426614174000',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  moduleIds: string[];
}