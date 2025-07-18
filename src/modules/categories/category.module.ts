import { Module } from '@nestjs/common'
import { CategoryRepository } from './domain/repositories/category.repository'
import { CreateCategoryUseCase } from './domain/use-cases/createCategory.useCase'
import { PrismaCategoryRepository } from './infra/database/repositories/prisma.category.repository'
import { CategoryController } from './infra/http/controllers/category.controller'
import { ListCategoryUseCase } from './domain/use-cases/listCategory.useCase'

@Module({
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    ListCategoryUseCase,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository
    }
  ]
})
export class CategoryModule {}
