import { Module } from '@nestjs/common'
import { BcryptModule } from 'src/infra/bcrypt/bcrypt.module'
import { NovuModule } from 'src/infra/services/novu/novu.module'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUser.UseCase'
import { findByEmailUseCase } from './domain/use-cases/findByEmail.UseCase'
import { UpdatePasswordUseCase } from './domain/use-cases/updatePasswordUseCase'
import { PrismaUserRepository } from './infra/database/repositories/prisma.user.repository'
import { UserController } from './infra/http/controller/user.controller'

@Module({
  imports: [BcryptModule, NovuModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    CreateUserUseCase,
    findByEmailUseCase,
    UpdatePasswordUseCase
  ],
  exports: [findByEmailUseCase, CreateUserUseCase]
})
export class UserModule {}
