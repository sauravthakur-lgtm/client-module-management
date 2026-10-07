import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Saurav Thakur',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'saurav.thakur@anviam.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}