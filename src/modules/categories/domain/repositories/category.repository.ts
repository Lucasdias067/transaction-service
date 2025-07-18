import { CategoryResponseDto } from '../../infra/http/dtos/category.dto'
import { CategoryEntity, CategoryEntityProps } from '../entities/category.entity'

export abstract class CategoryRepository {
  abstract create(category: CategoryEntity): Promise<CategoryEntity>
  abstract list(userId: string): Promise<CategoryResponseDto<CategoryEntityProps>>
}
