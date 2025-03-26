import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_REFRESH_SECRET ||
        'ccba9db2669a647f3b25d3917445f8a9cd1ce2a7b6c640540c09b9fb3b4eb87b',
      passReqToCallback: true,
    });
  }

  validate(request, token) {
    const refreshToken = request.headers.authorization
      ?.replace('Bearer', '')
      .trim();

    request['currentUser'] = {
      id: token.sub,
      refreshToken: refreshToken,
    };
    return true;
  }
}
