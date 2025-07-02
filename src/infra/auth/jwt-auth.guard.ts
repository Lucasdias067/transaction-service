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
        'Sua sessão expirou, por favor faça o login novamente.'
      )
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token inválido. Acesso negado.')
    }

    if (err || !user) {
      const message =
        info?.message || 'Você não tem permissão para acessar este recurso.'
      throw new UnauthorizedException(message)
    }

    return user
  }
}
