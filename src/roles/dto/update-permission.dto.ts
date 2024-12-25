import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({ example: 'create:user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Kullanıcı oluşturma izni', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 