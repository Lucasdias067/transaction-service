import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { CategoryEntity } from 'src/modules/categories/domain/entities/category.entity'
import { CategoryRepository } from 'src/modules/categories/domain/repositories/category.repository'
import { CategoryResponseDto } from '../../http/dtos/category.dto'
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

  async list(userId: string): Promise<CategoryResponseDto<CategoryEntity>> {
    const listCategories = await this.prismaService.category.findMany({
      where: {
        ...(userId && { userId })
      }
    })

    const result = {
      data: listCategories.map(PrismaCategoryMapper.toEntity)
    }

    return result
  }
}
