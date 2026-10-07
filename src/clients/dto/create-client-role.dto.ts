import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Manager',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}