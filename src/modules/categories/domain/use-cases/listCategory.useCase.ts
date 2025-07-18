import { Either, left, right } from 'src/core/logic/Either'
import { CategoryResponseDto } from '../../infra/http/dtos/category.dto'
import { CategoryEntityProps } from '../entities/category.entity'
import { CategoryRepository } from '../repositories/category.repository'

type Response = Either<Error, CategoryResponseDto<CategoryEntityProps>>

export class ListCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(userId: string): Promise<Response> {
    if (!userId) return left(new Error('Usuário sem ID'))

    const category = await this.categoryRepository.list(userId)

    if (category) return right(category)

    return left(category)
  }
}
