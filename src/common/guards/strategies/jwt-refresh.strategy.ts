import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from '../../types/http.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, token) {
    const refreshToken = request.headers.authorization
      ?.replace('Bearer', '')
      .trim();

    request['currentUser'] = {
      id: token.sub,
      refreshToken: refreshToken,
      pantryId: token.pantryId,
    };
    return true;
  }
}
