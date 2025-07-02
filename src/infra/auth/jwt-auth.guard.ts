import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.AUTH_DISABLED === 'true') {
      return true
    }

    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(
        'Your session has expired, please log in again.'
      )
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token. Access denied.')
    }

    if (err || !user) {
      const message =
        info?.message || 'You do not have permission to access this resource.'
      throw new UnauthorizedException(message)
    }

    return user
  }
}
