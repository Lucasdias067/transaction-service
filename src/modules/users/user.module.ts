import { Module } from '@nestjs/common'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUserUseCase'
import { FindByEmailUserUseCase } from './domain/use-cases/findByEmailUseCase'
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
    CreateUserUseCase,
    FindByEmailUserUseCase
  ]
})
export class UserModule {}
