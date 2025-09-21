import { Body, Controller, Param, Patch } from '@nestjs/common'
import { UpdatePasswordUseCase } from 'src/modules/users/domain/use-cases/updatePasswordUseCase'
import { UpdateUserDto } from '../dtos/user.dto'

@Controller('/users')
export class UserController {
  constructor(private updatePasswordUserUseCase: UpdatePasswordUseCase) {}

  @Patch('/:id/password')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const result = await this.updatePasswordUserUseCase.execute(
      id,
      userData.password
    )

    return result
  }
}
