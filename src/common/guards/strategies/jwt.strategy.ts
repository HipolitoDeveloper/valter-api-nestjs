import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../../modules/user/user.service';
import { ErrorException } from '../../exceptions/error.exception';
import { ERRORS } from '../../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_SECRET ||
        'ccba9db2669a647f3b25d3917445f8a9cd1ce2a7b6c640540c09b9fb3b4eb87b',
      passReqToCallback: true,
    });
  }

  public validate = async (request, token): Promise<boolean> => {
    try {
      const currentUser = await this.userService.findOneById(token.sub);

      // if (
      //   currentUser.stateId === USER_STATE.BLOCKED ||
      //   currentUser.tenant[0].stateId === BUSINESS_PARTNER_STATE.BLOCKED
      // ) {
      //   return false;
      // }

      request['currentUser'] = {
        id: currentUser.id,
        email: currentUser.email,
        // hierarchyCode: token.hierarchyCode,
        // tenantId: token.tenantId,
        // businessPartnerResponsibles: currentUser.businessPartnerResponsibles,
        // group: currentUser.group,
        // resources: currentUser.resources,
        // stateId: currentUser.stateId,
      };
      return true;
    } catch (error) {
      throw new ErrorException(ERRORS.UNAUTHORIZED, error);
    }
  };
}
