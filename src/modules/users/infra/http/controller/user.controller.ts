import { Body, Controller, Param, Patch } from '@nestjs/common'
import { UpdatePasswordUseCase } from 'src/modules/users/domain/use-cases/updatePasswordUseCase'

@Controller('/users')
export class UserController {
  constructor(private updatePasswordUserUseCase: UpdatePasswordUseCase) {}

  @Patch('/:id/password')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { password: string }
  ) {
    const result = await this.updatePasswordUserUseCase.execute(
      id,
      data.password
    )

    return result
  }
}
