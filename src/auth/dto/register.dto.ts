import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Kullanıcı adı',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2, { message: 'İsim en az 2 karakter olmalıdır' })
  name: string;

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
  })
  password: string;
} 