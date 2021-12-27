import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: TokenPayload,
  ): Promise<User | undefined> {
    if (
      request.headers.authorization &&
      request.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const refreshToken: string = request.headers?.authorization.split(' ')[1];
      return await this.usersService.findByIdAndRefreshToken(
        payload.userId,
        refreshToken,
      );
    }

    return undefined;
  }
}
