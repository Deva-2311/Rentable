import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // If no roles are defined on the route, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
