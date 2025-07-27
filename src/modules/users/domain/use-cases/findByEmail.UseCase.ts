import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { UsersEntityProps } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<UseCaseError, UsersEntityProps>

@Injectable()
export class findByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<Response> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) return left(new UseCaseError('User with that email not exists'))

    return right(user)
  }
}
