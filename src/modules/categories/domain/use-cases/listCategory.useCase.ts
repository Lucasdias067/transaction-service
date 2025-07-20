import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { CategoryResponseDto } from '../../infra/http/dtos/category.dto'
import { CategoryEntityProps } from '../entities/category.entity'
import { CategoryMapper } from '../mappers/category.mapper'
import { CategoryRepository } from '../repositories/category.repository'

type Response = Either<UseCaseError, CategoryResponseDto<CategoryEntityProps>>

@Injectable()
export class ListCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(userId: string): Promise<Response> {
    if (!userId) return left(new UseCaseError('User does not have ID'))

    const category = await this.categoryRepository.list(userId)

    if (!category) {
      return left(new UseCaseError('No category found'))
    }

    const result = {
      data: category.map(CategoryMapper.toHTTP)
    }

    return right(result)
  }
}
