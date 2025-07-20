import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { LoginUserUseCase } from 'src/modules/auth/domain/use-cases/loginUser.UseCase'
import { CreateUserUseCase } from 'src/modules/users/domain/use-cases/createUser.UseCase'
import { UserRequestDto } from 'src/modules/users/infra/http/dtos/user.dto'
import { UserLoginRequestDto } from '../dtos/auth.dto'

@Controller('/auth')
export class AuthController {
  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private createUserUseCase: CreateUserUseCase
  ) {}

  @Post('/sign-in')
  async login(@Body() data: UserLoginRequestDto) {
    const result = await this.loginUserUseCase.execute(data)

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof UseCaseError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error, {
        description: 'An unexpected error occurred during user login.'
      })
    }

    return result.value
  }

  @Post('/sign-up')
  async register(@Body() data: UserRequestDto) {
    const result = await this.createUserUseCase.execute(data)

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message)
      }

      if (error instanceof UseCaseError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error, {
        description: 'An unexpected error occurred during user registration.'
      })
    }

    return result.value
  }
}
