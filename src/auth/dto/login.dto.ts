import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Kullanıcı email adresi',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @ApiProperty({
    description: 'Kullanıcı şifresi',
    example: 'Abc123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;
} 