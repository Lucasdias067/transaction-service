import { Inject, Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { PasswordHasherRepository } from 'src/infra/bcrypt/passwordHasher.repository'
import { UserRequestDto, UserResponseDto } from '../../infra/http/dtos/user.dto'
import { UserMapper } from '../mappers/user.mapper'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<UseCaseError, UserResponseDto>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    @Inject('bcryptService')
    private hashService: PasswordHasherRepository
  ) {}

  async execute(data: UserRequestDto): Promise<Response> {
    const emailExists = await this.userRepository.findByEmail(data.email)

    if (emailExists) {
      return left(new UseCaseError('Email already exists'))
    }

    const hashPassword = await this.hashService.hash(data.password, 10)

    const user = await this.userRepository.create(
      UserMapper.toDomain({ ...data, password: hashPassword })
    )

    if (!user) return left(new UseCaseError('Error on creating user'))

    return right(UserMapper.toHTTP(user))
  }
}
