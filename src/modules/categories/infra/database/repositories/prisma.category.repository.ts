import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { CategoryEntity } from 'src/modules/categories/domain/entities/category.entity'
import { CategoryRepository } from 'src/modules/categories/domain/repositories/category.repository'
import { PrismaCategoryMapper } from '../mappers/prisma.category.mapper'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(
    @Inject('prismaService') private readonly prismaService: PrismaService
  ) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const newCategory = await this.prismaService.category.create({
      data: PrismaCategoryMapper.toPersistence(category)
    })

    return PrismaCategoryMapper.toEntity(newCategory)
  }

  async list(userId: string): Promise<CategoryEntity[]> {
    const listCategories = await this.prismaService.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }]
      },
      orderBy: { name: 'asc' }
    })

    const result = listCategories.map(PrismaCategoryMapper.toEntity)

    return result
  }
}
