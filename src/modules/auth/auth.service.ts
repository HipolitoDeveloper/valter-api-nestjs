import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { hash, isMatchHash } from '../../helper/hash.handler';
import { UserService } from '../user/user.service';
import {
  UserControllerNamespace,
  UserServiceNamespace,
} from '../user/user.type';
import { AuthRepository } from './auth.repository';
import CreateUserBody = UserControllerNamespace.CreateUserBody;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    let user: UserServiceNamespace.FindOneByEmailResponse;
    try {
      user = await this.userService.findOneByEmail(email);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!user) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }
    //
    // if (user.stateId === USER_STATE.BLOCKED) {
    //   throw new UnauthorizedException(ERRORS.CUSTOM_ERROR.USER.BLOCKED_USER);
    // }
    //
    // if (user.tenant[0].stateId === BUSINESS_PARTNER_STATE.BLOCKED) {
    //   throw new UnauthorizedException(
    //     ERRORS.CUSTOM_ERROR.BUSINESS_PARTNER.BLOCKED_TENANT,
    //   );
    // }

    if (!(await isMatchHash(password, user.password))) {
      throw new UnauthorizedException(
        ERRORS.CUSTOM_ERROR.USER.MISMATCH_PASSWORD,
      );
    }

    // if (user.stateId === USER_STATE.CREATED) {
    //   throw new ErrorWithParamException(
    //     ERRORS.CUSTOM_ERROR.USER.CREATED_USER,
    //     user.email,
    //   );
    // }

    const tokens = await this.getTokens(
      user.id,
      user.firstName,
      user.pantry.id,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      firstName: user.firstName,
    };
  }

  async signUp(user: CreateUserBody) {
    let userInfo: UserServiceNamespace.FindOneByEmailResponse;
    try {
      userInfo = await this.userService.findOneByEmail(user.email);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (userInfo) {
      throw new ErrorException(ERRORS.CUSTOM_ERROR.USER.ALREADY_CREATED_USER);
    }

    const hashedPassword = await hash(user.password);

    let createdUser: UserServiceNamespace.CreateResponse;
    try {
      createdUser = await this.userService.create({
        ...user,
        password: hashedPassword,
      });
    } catch (error) {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR, error);
    }

    const tokens = await this.getTokens(
      createdUser.id,
      createdUser.firstName,
      createdUser.pantry.name,
    );
    await this.updateRefreshToken(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    return this.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    let session;

    try {
      session = await this.getSessionByUserId(userId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!session?.refreshToken) {
      throw new ErrorException(ERRORS.UNAUTHORIZED);
    }

    if (!(await isMatchHash(refreshToken, session.refreshToken))) {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(
      session.userId,
      session.firstName,
      session.pantryId,
    );
    await this.updateRefreshToken(session.userId, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    let hashedRefreshToken = refreshToken;
    if (hashedRefreshToken) {
      hashedRefreshToken = await hash(refreshToken);
    }

    await this.authRepository.upsertSession(userId, hashedRefreshToken);
  }

  async getTokens(userId: string, firstName: string, pantryId: string) {
    const payload = {
      sub: userId,
      username: firstName,
      pantryId,
    };

    const accessTokenExpiresIn = 15 * 60; // 15 minutes in seconds
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: {
        accessToken: accessTokenExpiresIn,
        refreshToken: refreshTokenExpiresIn,
      },
      expiresAt: {
        accessToken: currentTimestamp + accessTokenExpiresIn,
        refreshToken: currentTimestamp + refreshTokenExpiresIn,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findOneById(userId);

    return user;
  }

  async getSessionByUserId(userId: string) {
    const session = await this.authRepository.findByUserId(userId);

    return session;
  }
}
