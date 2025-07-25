import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { CreateTransactionUseCase } from 'src/modules/transactions/domain/use-cases/createTransaction.useCase'
import { ListTransactionUseCase } from 'src/modules/transactions/domain/use-cases/listTransaction.useCase'
import { TransactionRequestDto } from '../dtos/transaction.dto'

@Controller('/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionUseCase: ListTransactionUseCase
  ) {}

  @Post()
  async create(@Body() body: TransactionRequestDto, @Req() request: Request) {
    const userId = request.user?.sub as string

    const result = await this.createTransactionUseCase.execute(body, userId)

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
  async list(@Query() params: PaginateQuery, @Req() request: Request) {
    const options = request.user

    const result = await this.listTransactionUseCase.execute(params, options)

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
