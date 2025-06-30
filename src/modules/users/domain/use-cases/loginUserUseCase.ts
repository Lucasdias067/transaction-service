import { Either, right } from 'src/core/logic/Either'
import {
  UserLoginRequestDto,
  UserResponseDto
} from '../../infra/http/dtos/user.dto'
import { UserRepository } from '../repositories/user.repository'
import { BadRequestException, Injectable } from '@nestjs/common'

type Response = Either<Error, UserResponseDto | null>

@Injectable()
export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserLoginRequestDto): Promise<Response> {
    const userExists = await this.userRepository.findByEmail(data.email)

    if (!userExists) throw new BadRequestException('User Not Exists')

    return right(null)
  }
}
