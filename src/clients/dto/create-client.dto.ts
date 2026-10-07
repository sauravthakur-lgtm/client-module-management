import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Name of the client',
    example: 'ABC Company',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the client',
    example: 'admin@abccompany.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the client',
    example: 'Password@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}