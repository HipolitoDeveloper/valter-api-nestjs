import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
import { UserService } from '../../../modules/user/user.service';
import { isMatchHash } from '../../../helper/hash.handler';
import { ERRORS } from '../../enum';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    // const businessPartnerId = req.body.business_partner_id;
    const businessPartnerId = 1;
    const user = await this.userService.findOneByEmail(
      username,
      // businessPartnerId,
      // 'INTE',
    );

    if (user) {
      if (await isMatchHash(password, user?.password)) {
        req['currentUser'] = {
          id: user.id,
          email: user.email,
          // tenantId: businessPartnerId,
          // resources: user.resources,
          // hierarchyCode: user.tenant[0].hierarchyCode,
        };
        return true;
      } else {
        throw new UnauthorizedException(ERRORS.UNAUTHORIZED);
      }
    } else {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED);
    }
  };
}
