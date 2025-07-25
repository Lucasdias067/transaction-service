import { randomUUID } from 'node:crypto'
import type {
  UserRequestDto,
  UserResponseDto
} from '../../infra/http/dtos/user.dto'
import { UserEntity } from '../entities/user.entity'

export class UserMapper {
  static toDomain(user: UserRequestDto): UserEntity {
    const userEntity = new UserEntity({
      id: randomUUID(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return userEntity
  }

  static toHTTP(user: UserEntity): UserResponseDto {
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return userResponse
  }
}
