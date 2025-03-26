import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERRORS } from '../enum';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { USER_STATE } from '../../modules/user/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required resource and action(s) from the @Roles decorator
    const rolesMetadata = this.reflector.get<{
      resource: string;
      action: string | string[];
    }>('roles', context.getHandler());

    if (!rolesMetadata) {
      return true;
    }

    const { resource, action } = rolesMetadata;

    const req = context.switchToHttp().getRequest();
    const user = req.currentUser;

    if (!user) {
      throw new UnauthorizedException(ERRORS.UNAUTHORIZED);
    }

    if (user.stateId === USER_STATE.CREATED) {
      return false;
    }

    const userResources = user.resources || [];
    const hasResource = userResources[resource];

    if (!hasResource) {
      throw new ForbiddenException(ERRORS.FORBIDDEN);
    }

    // Ensure action can handle both string and array
    const actionsToCheck = Array.isArray(action) ? action : [action];

    const hasAction = actionsToCheck.some((act) => hasResource[act]);

    if (!hasAction) {
      throw new ForbiddenException(ERRORS.FORBIDDEN);
    }

    return true;
  }
}
