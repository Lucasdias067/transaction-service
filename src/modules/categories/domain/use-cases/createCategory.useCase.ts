import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { CategoryRequestDto } from '../../infra/http/dtos/category.dto'
import { CategoryEntityProps } from '../entities/category.entity'
import { CategoryMapper } from '../mappers/category.mapper'
import { CategoryRepository } from '../repositories/category.repository'

type Response = Either<UseCaseError, CategoryEntityProps>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(
    category: CategoryRequestDto,
    userId: string
  ): Promise<Response> {
    const categoryValues = await this.categoryRepository.create(
      CategoryMapper.toDomain(category, userId)
    )

    if (!categoryValues) {
      return left(new UseCaseError('Error on creating category'))
    }

    return right(CategoryMapper.toHTTP(categoryValues))
  }
}
