import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Either, left, right } from 'src/core/logic/Either'
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository'
import {
  UserLoginRequestDto,
  UserLoginResponseDto
} from '../../infra/http/dtos/auth.dto'

type Response = Either<Error, UserLoginResponseDto>

@Injectable()
export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(data: UserLoginRequestDto): Promise<Response> {
    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      return left(new BadRequestException('User with that email not exists'))
    }

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
