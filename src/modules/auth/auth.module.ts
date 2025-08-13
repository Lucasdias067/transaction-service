import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModules } from 'src/infra/auth/jwt.module'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { JwtStrategy } from 'src/infra/auth/jwt-strategy.service'
import { BcryptService } from 'src/infra/bcrypt/bcrypt.service'
import { RolesGuard } from 'src/infra/roles/roles.guard'
import { UserModule } from '../users/user.module'
import { LoginUserUseCase } from './domain/use-cases/loginUser.UseCase'
import { AuthController } from './infra/http/controller/auth.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModules.forRoot(),
    PassportModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    LoginUserUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: 'bcryptService',
      useClass: BcryptService
    }
  ],
  exports: [JwtModules.forRoot()]
})
export class AuthModule {}
