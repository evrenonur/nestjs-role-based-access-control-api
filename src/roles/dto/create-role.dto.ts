import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sistem yöneticisi rolü' })
  @IsString()
  description: string;

  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
} 