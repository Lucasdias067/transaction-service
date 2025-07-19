import { CategoryEntity } from '../entities/category.entity'

export abstract class CategoryRepository {
  abstract create(category: CategoryEntity): Promise<CategoryEntity>
  abstract list(userId: string): Promise<CategoryEntity[]>
}
