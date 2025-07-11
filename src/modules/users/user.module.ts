import { Module } from '@nestjs/common'
import { UserRepository } from './domain/repositories/user.repository'
import { CreateUserUseCase } from './domain/use-cases/createUser.UseCase'
import { FindByEmailWithPasswordUseCase } from './domain/use-cases/findByEmailWithPassword.UseCase'
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
    FindByEmailWithPasswordUseCase
  ],
  exports: [FindByEmailWithPasswordUseCase]
})
export class UserModule {}
