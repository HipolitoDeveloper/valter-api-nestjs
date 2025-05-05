import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtRefreshGuard } from '../../common/guards/auth-jwt-refresh.guard';
import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { UserControllerNamespace } from '../user/user.type';
import { AuthService } from './auth.service';
import { authValidator, SigninBody } from './auth.validator';
import { userValidator } from '../user/user.validator';
import { Request } from '../../common/types/http.type';
import { Public } from '../../common/decorators/public-route.decorator';

import CreateUserBody = UserControllerNamespace.CreateUserBody;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(authValidator.signIn))
  async signIn(@Body() signInDto: SigninBody) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(userValidator.createUser))
  async create(@Body() user: CreateUserBody) {
    return this.authService.signUp(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request) {
    return this.authService.logout(request.currentUser.id);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refreshTokens(@Req() req: Request) {
    return this.authService.refreshTokens(
      req.currentUser.id,
      req.currentUser.refreshToken,
    );
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @Roles(RESOURCES.USER, ACTIONS.ME)
  me(@Req() request: Request) {
    return this.authService.getProfile(request.currentUser.id);
  }
}
