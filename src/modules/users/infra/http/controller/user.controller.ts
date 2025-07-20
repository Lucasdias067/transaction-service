import { Controller } from '@nestjs/common'
import { CreateUserUseCase } from 'src/modules/users/domain/use-cases/createUser.UseCase'

@Controller('/users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
}
