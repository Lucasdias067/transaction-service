import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModules } from 'src/infra/auth/jwt.module'
import { JwtStrategy } from 'src/infra/auth/jwt.strategy'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { RolesGuard } from 'src/infra/auth/roles.guard'
import { UserRepository } from '../users/domain/repositories/user.repository'
import { PrismaUserRepository } from '../users/infra/database/repositories/prisma.user.repository'
import { LoginUserUseCase } from './domain/use-cases/loginUserUseCase'
import { AuthController } from './infra/http/controller/auth.controller'

@Module({
  imports: [JwtModules.forRoot(), PassportModule],
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    LoginUserUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [JwtModules.forRoot()]
})
export class AuthModule {}
