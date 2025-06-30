import { Either, right } from "src/core/logic/Either"
import { UserRepository } from "../repositories/user.repository"
import { UserRequestDto, UserResponseDto } from "../../infra/http/dtos/user.dto"
import { Injectable } from "@nestjs/common"
import { UserMapper } from "../mappers/user.mapper"

type Response = Either<Error, UserResponseDto>

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserRequestDto): Promise<Response> {
    const user = await this.userRepository.create(UserMapper.toDomain(data))

    return right(UserMapper.toHTTP(user))
  }
}
