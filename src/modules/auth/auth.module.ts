import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtModules } from 'src/infra/auth/jwt.module'
import { UserRepository } from '../users/domain/repositories/user.repository'
import { PrismaUserRepository } from '../users/infra/database/repositories/prisma.user.repository'
import { LoginUserUseCase } from './domain/use-cases/loginUserUseCase'
import { AuthController } from './infra/http/controller/auth.controller'

@Module({
  imports: [JwtModules.forRoot()],
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: 'jwtService',
      useClass: JwtService
    },
    LoginUserUseCase
  ]
})
export class AuthModule {}
