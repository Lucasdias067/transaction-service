import { ExecutionContext, Injectable } from '@nestjs/common'
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
}
