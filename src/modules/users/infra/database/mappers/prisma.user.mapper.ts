import { Prisma } from '@prisma/client'
import { UserEntity } from 'src/modules/users/domain/entities/user.entity'

export class PrismaUserMapper {
  static toDomain(user: Prisma.UserGetPayload<{}>): UserEntity {
    const userEntity = new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
    return userEntity
  }

  static toPersistence(user: UserEntity): Prisma.UserCreateInput {
    const userPersistence = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return userPersistence
  }
}
