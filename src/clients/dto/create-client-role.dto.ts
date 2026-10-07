import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateClientRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}