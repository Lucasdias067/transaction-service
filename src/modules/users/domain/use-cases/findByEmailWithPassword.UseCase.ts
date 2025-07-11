import { BadRequestException, Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/logic/Either'
import { UsersEntityProps } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

type Response = Either<Error, UsersEntityProps>

@Injectable()
export class FindByEmailWithPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<Response> {
    const user = await this.userRepository.findByEmail(email)

    if (!user)
      return left(new BadRequestException('User with that email not exists'))

    return right(user)
  }
}
