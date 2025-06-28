import { Injectable } from '@nestjs/common'
import { type Either, right } from 'src/core/logic/Either'
import type {
  UserRequestDto,
  UserResponseDto
} from '../../infra/http/dtos/user.dto'
import { UserMapper } from '../mappers/user.mapper'
import type { UserRepository } from '../repositories/user.repository'

type Response = Either<Error, UserResponseDto>

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserRequestDto): Promise<Response> {
    const user = await this.userRepository.create(UserMapper.toDomain(data))

    return right(UserMapper.toHTTP(user))
  }
}
