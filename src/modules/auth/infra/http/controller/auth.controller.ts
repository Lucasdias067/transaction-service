import { Body, Controller, Post } from '@nestjs/common'
import { LoginUserUseCase } from 'src/modules/auth/domain/use-cases/loginUserUseCase'
import { UserLoginRequestDto } from '../dtos/auth.dto'

@Controller('/auth')
export class AuthController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  @Post('/sign-in')
  async login(@Body() data: UserLoginRequestDto) {
    try {
      const result = await this.loginUserUseCase.execute(data)

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      throw error.message
    }
  }
}
