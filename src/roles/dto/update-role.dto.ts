import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Admin', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Sistem yöneticisi rolü', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: [1, 2, 3], type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
} 