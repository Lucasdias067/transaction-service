import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { CreateCategoryUseCase } from 'src/modules/categories/domain/use-cases/createCategory.useCase'
import { ListCategoryUseCase } from 'src/modules/categories/domain/use-cases/listCategory.useCase'
import { CategoryRequestDto } from '../dtos/category.dto'

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoryUseCase: ListCategoryUseCase
  ) {}

  @Post()
  async create(@Body() body: CategoryRequestDto, @Req() request: Request) {
    const userId = request.user?.sub as string

    const result = await this.createCategoryUseCase.execute(body, userId)

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof UseCaseError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }

    return result.value
  }

  @Get()
  async list(@Req() request: Request) {
    const userId = request.user?.sub as string

    const result = await this.listCategoryUseCase.execute(userId)

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof UseCaseError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }

    return result.value
  }
}
