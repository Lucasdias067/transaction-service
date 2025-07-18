import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { CategoryResponseDto } from '../../infra/http/dtos/category.dto'
import { CategoryEntityProps } from '../entities/category.entity'
import { CategoryRepository } from '../repositories/category.repository'

type Response = Either<Error, CategoryResponseDto<CategoryEntityProps>>

@Injectable()
export class ListCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(userId: string): Promise<Response> {
    if (!userId) return left(new Error('Usuário sem ID'))

    const category = await this.categoryRepository.list(userId)

    if (!category) {
      return left(new UseCaseError('No category'))
    }

    return right(category)
  }
}
