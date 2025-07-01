import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException
} from '@nestjs/common'
import { CreateUserUseCase } from 'src/modules/users/domain/use-cases/createUserUseCase'
import { LoginUserUseCase } from 'src/modules/users/domain/use-cases/loginUserUseCase'
import { UserLoginRequestDto, UserRequestDto } from '../dtos/user.dto'

@Controller('/auth')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  @Post('/sign-up')
  async register(@Body() data: UserRequestDto) {
    try {
      const result = await this.createUserUseCase.execute(data)

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Post('/sign-in')
  async login(@Body() data: UserLoginRequestDto) {
    try {
      const result = await this.loginUserUseCase.execute(data)

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }
}
