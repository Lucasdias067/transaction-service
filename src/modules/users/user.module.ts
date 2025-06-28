import { Module } from '@nestjs/common'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUserUseCase'
import { PrismaUserRepository } from './infra/database/repositories/prisma.user.repository'
import { UserController } from './infra/http/controller/user.controller'

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    CreateUserUseCase
  ]
})
export class UserModule {}
