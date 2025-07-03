import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreateUserUseCase } from 'src/modules/users/domain/use-cases/createUserUseCase'
import { UserRequestDto } from '../dtos/user.dto'

@Controller('/auth')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post('/sign-up')
  async register(@Body() data: UserRequestDto) {
    try {
      const result = await this.createUserUseCase.execute(data)

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error)
      }
      throw error.message
    }
  }
}
