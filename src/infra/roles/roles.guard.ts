import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    )

    if (!requiredRoles) return true

    const request: Request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (process.env.AUTH_DISABLED === 'true' && !token) {
      return true
    }

    if (!request.user || !request.user.roles) {
      throw new ForbiddenException('User does not have access')
    }

    const isTheSameRole = requiredRoles.some(role =>
      request.user?.roles.includes(role)
    )

    if (!isTheSameRole) {
      throw new ForbiddenException('User does not have access')
    }

    return true
  }
}
