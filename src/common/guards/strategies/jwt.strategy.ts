import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
import { ErrorException } from '../../exceptions/error.exception';
import { ERRORS } from '../../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  public validate = async (request, token): Promise<boolean> => {
    try {
      const currentSession = await this.authService.getSessionByUserId(
        token.sub,
      );

      if (!currentSession.refreshToken) {
        return false;
      }

      request['currentUser'] = {
        id: currentSession.userId,
        pantryId: currentSession.pantryId,
        firstName: currentSession.firstName,
      };
      return true;
    } catch (error) {
      throw new ErrorException(ERRORS.UNAUTHORIZED, error);
    }
  };
}
