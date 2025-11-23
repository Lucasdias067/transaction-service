import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
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

  @Post('/:id/upload-avatar')
  async updateUserAvatar(
    @Param('id') id: string,
    @Body() data: { avatarUrl: string }
  ) {
    return { message: `User ${id} avatar uploaded to ${data.avatarUrl}` }
  }
}
