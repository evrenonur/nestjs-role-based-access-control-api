import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Kullanıcı adı',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'İsim en az 2 karakter olmalıdır' })
  name?: string;

  @ApiProperty({
    description: 'Kullanıcı email adresi',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email?: string;

  @ApiProperty({
    description: 'Kullanıcı şifresi',
    example: 'Abc123!',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password?: string;
} 