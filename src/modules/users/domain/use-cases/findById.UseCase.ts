import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { UsersEntityProps } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<UseCaseError, UsersEntityProps>

@Injectable()
export class findByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<Response> {
    const user = await this.userRepository.findById(id)

    if (!user) return left(new UseCaseError('User with that id not exists'))

    return right(user)
  }
}
