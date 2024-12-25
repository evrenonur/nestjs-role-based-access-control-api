import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
  @ApiProperty({
    description: 'Atanacak rol ID\'leri',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
} 