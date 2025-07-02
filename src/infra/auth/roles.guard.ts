import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    )

    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()

    if (!user || !user.roles) {
      throw new ForbiddenException('User does not have roles')
    }

    return requiredRoles.some(role => user.roles.includes(role))
  }
}
