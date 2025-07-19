import { Prisma } from '@prisma/client'
import {
  CategoryEntity,
  CategoryEntityProps
} from 'src/modules/categories/domain/entities/category.entity'

export class PrismaCategoryMapper {
  static toEntity(
    prismaCategory: Prisma.CategoryGetPayload<{}>
  ): CategoryEntity {
    const categoryDomain = new CategoryEntity({
      id: prismaCategory.id,
      name: prismaCategory.name,
      type: prismaCategory.type,
      userId: prismaCategory.userId
    })
    return categoryDomain
  }

  static toPersistence(category: CategoryEntity): CategoryEntityProps {
    return {
      id: category.id,
      type: category.type,
      userId: category.userId,
      name: category.name
    }
  }
}
