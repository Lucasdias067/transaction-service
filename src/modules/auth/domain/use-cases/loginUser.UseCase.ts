import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Either, left, right } from 'src/core/logic/Either'
import { FindByEmailWithPasswordUseCase } from 'src/modules/users/domain/use-cases/findByEmailWithPassword.UseCase'
import {
  UserLoginRequestDto,
  UserLoginResponseDto
} from '../../infra/http/dtos/auth.dto'

type Response = Either<Error, UserLoginResponseDto>

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private findByEmailWithPasswordUseCase: FindByEmailWithPasswordUseCase
  ) {}

  async execute(data: UserLoginRequestDto): Promise<Response> {
    const userOrError = await this.findByEmailWithPasswordUseCase.execute(
      data.email
    )

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user = userOrError.value

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      return left(new BadRequestException('Credentials is not valid'))
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      roles: user.role
    }

    const token = await this.jwtService.signAsync(payload)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      access_token: `Bearer ${token}`
    }

    return right(userData)
  }
}
