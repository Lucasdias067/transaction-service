import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Either, left, right } from 'src/core/logic/Either'
import { UserRequestDto, UserResponseDto } from '../../infra/http/dtos/user.dto'
import { UserMapper } from '../mappers/user.mapper'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<Error, UserResponseDto>

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserRequestDto): Promise<Response> {
    const hashPassword = await bcrypt.hash(data.password, 10)

    const user = await this.userRepository.create(
      UserMapper.toDomain({ ...data, password: hashPassword })
    )

    if (!user) return left(new Error())

    return right(UserMapper.toHTTP(user))
  }
}
