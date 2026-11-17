import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, RolePermissions } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRole } from '../enums/role.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // If no permissions are defined on the route, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false;
    }

    const userPermissions =
      user.permissions || RolePermissions[user.role as UserRole] || [];

    // Check if the user has ALL required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
