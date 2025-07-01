import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Either, left, right } from 'src/core/logic/Either'
import { UserLoginRequestDto } from '../../infra/http/dtos/user.dto'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<Error, string>

@Injectable()
export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    @Inject('jwtService') private readonly jwtService: JwtService
  ) {}

  async execute(data: UserLoginRequestDto): Promise<Response> {
    const userExists = await this.userRepository.findByEmail(data.email)

    if (!userExists) {
      return left(new BadRequestException('User with that email not exists'))
    }

    const decodedPassword = await bcrypt.compare(
      data.password,
      userExists.password
    )

    if (!decodedPassword) {
      return left(new BadRequestException('Credentials is not valid'))
    }

    const token = this.jwtService.sign(
      { sub: userExists.id },
      {
        privateKey: process.env.JWT_SECRET_KEY,
        expiresIn: '1h'
      }
    )

    return right(`Bearer ${token}`)
  }
}
