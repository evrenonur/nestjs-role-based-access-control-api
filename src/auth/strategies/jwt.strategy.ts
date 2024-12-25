import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    
    // payload.sub'ı number'a çevirelim
    const userId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    
    if (isNaN(userId)) {
      throw new UnauthorizedException('Geçersiz kullanıcı ID');
    }

    const userWithRoles = await this.usersService.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!userWithRoles) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    return userWithRoles;
  }
} 