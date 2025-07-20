import { Module } from '@nestjs/common'
import { BcryptService } from 'src/infra/bcrypt/bcrypt.service'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUser.UseCase'
import { findUserByEmailUseCase } from './domain/use-cases/findUserByEmail.UseCase'
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
    findUserByEmailUseCase
  ],
  exports: [findUserByEmailUseCase, CreateUserUseCase]
})
export class UserModule {}
