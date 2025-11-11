import { Module } from '@nestjs/common'
import { BcryptService } from 'src/infra/bcrypt/bcrypt.service'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUser.UseCase'
import { findByEmailUseCase } from './domain/use-cases/findByEmail.UseCase'
import { UpdatePasswordUseCase } from './domain/use-cases/updatePasswordUseCase'
import { PrismaUserRepository } from './infra/database/repositories/prisma.user.repository'
import { UserController } from './infra/http/controller/user.controller'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: 'bcryptService',
      useClass: BcryptService
    },
    CreateUserUseCase,
    findByEmailUseCase,
    UpdatePasswordUseCase
  ],
  exports: [findByEmailUseCase, CreateUserUseCase]
})
export class UserModule {}
