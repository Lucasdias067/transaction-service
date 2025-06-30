import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { UserEntity } from 'src/modules/users/domain/entities/user.entity'
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository'
import { PrismaUserMapper } from '../mappers/prisma.user.mapper'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    @Inject('prismaService') private readonly prismaService: PrismaService
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const userPersistence = PrismaUserMapper.toPersistence(user)

    const newUser = await this.prismaService.user.create({
      data: userPersistence
    })

    return PrismaUserMapper.toDomain(newUser)
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const findUser = await this.prismaService.user.findUniqueOrThrow({
      where: {
        email
      }
    })

    return PrismaUserMapper.toDomain(findUser)
  }
}
