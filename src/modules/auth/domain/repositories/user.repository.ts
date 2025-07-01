import type { UserEntity } from '../entities/user.entity'

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<UserEntity>
  abstract findByEmail(email: string): Promise<UserEntity>
}
