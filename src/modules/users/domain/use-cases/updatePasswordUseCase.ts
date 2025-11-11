import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { UsersEntityProps } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<UseCaseError, UsersEntityProps>

@Injectable()
export class UpdatePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, newPassword: string): Promise<Response> {
    const userExists = await this.userRepository.findById(userId)

    if (!userExists) {
      return left(new UseCaseError('User not found'))
    }

    try {
      userExists.changePassword(newPassword)
    } catch (error) {
      return left(new UseCaseError(error.message))
    }

    const result = await this.userRepository.update(userId, userExists)

    return right(result)
  }
}
