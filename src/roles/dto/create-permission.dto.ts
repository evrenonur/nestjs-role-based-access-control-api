import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'create:user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Kullanıcı oluşturma izni' })
  @IsString()
  description: string;
} 