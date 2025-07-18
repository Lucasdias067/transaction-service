import { randomUUID } from 'node:crypto'
import { CategoryRequestDto } from '../../infra/http/dtos/category.dto'
import {
  CategoryEntity,
  CategoryEntityProps
} from '../entities/category.entity'

export class CategoryMapper {
  static toDomain(
    category: CategoryRequestDto,
    userId: string
  ): CategoryEntity {
    const categoryEntity = new CategoryEntity({
      id: randomUUID(),
      name: category.name,
      type: category.type,
      userId: userId
    })
    return categoryEntity
  }

  static toHTTP(category: CategoryEntity): CategoryEntityProps {
    const categoryResponse = {
      id: category.id,
      name: category.name,
      type: category.type,
      userId: category.userId
    }

    return categoryResponse
  }
}
