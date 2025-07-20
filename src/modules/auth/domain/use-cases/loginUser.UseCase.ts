import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { PasswordHasherRepository } from 'src/infra/bcrypt/passwordHasher.repository'
import { findUserByEmailUseCase } from 'src/modules/users/domain/use-cases/findUserByEmail.UseCase'
import {
  UserLoginRequestDto,
  UserLoginResponseDto
} from '../../infra/http/dtos/auth.dto'

type Response = Either<Error, UserLoginResponseDto>

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('bcryptService')
    private hashService: PasswordHasherRepository,
    private jwtService: JwtService,
    private findUserByEmailUseCase: findUserByEmailUseCase
  ) {}

  async execute(data: UserLoginRequestDto): Promise<Response> {
    const findUserEmail = await this.findUserByEmailUseCase.execute(data.email)

    if (findUserEmail.isLeft()) {
      return left(findUserEmail.value)
    }

    const user = findUserEmail.value

    const isPasswordValid = await this.hashService.compare(
      data.password,
      user.password
    )

    if (!isPasswordValid) {
      return left(new UseCaseError('Credentials is not valid'))
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
