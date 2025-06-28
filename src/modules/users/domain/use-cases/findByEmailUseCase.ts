import { Injectable } from '@nestjs/common'
import { type Either, right } from 'src/core/logic/Either'
import type {
  UserResponseDto
} from '../../infra/http/dtos/user.dto'
import { UserMapper } from '../mappers/user.mapper'
import type { UserRepository } from '../repositories/user.repository'

type Response = Either<Error, UserResponseDto>

@Injectable()
export class FindByEmailUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<Response> {
    const user = await this.userRepository.findByEmail(email)

    return right(UserMapper.toHTTP(user))
  }
}
