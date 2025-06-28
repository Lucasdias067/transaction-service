import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query
} from '@nestjs/common'
import { CreateTransactionUseCase } from 'src/modules/transactions/domain/use-cases/CreateTransaction.useCase'
import { ListTransactionUseCase } from 'src/modules/transactions/domain/use-cases/ListTransaction.useCase'
import { TransactionRequestDto } from '../dtos/transaction.dto'
import { CreateTransactionError } from 'src/modules/transactions/domain/use-cases/errors/CreateTransactionError'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { ListTransactionError } from 'src/modules/transactions/domain/use-cases/errors/ListTransactionError'

@Controller('/transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionUseCase: ListTransactionUseCase
  ) {}

  @Post()
  async create(@Body() body: TransactionRequestDto) {
    try {
      const result = await this.createTransactionUseCase.execute({
        ...body
      })

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      if (error instanceof CreateTransactionError) {
        throw new BadRequestException(error.message)
      }
      throw error.message
    }
  }

  @Get()
  async list(@Query() params: PaginateQuery) {
    try {
      const result = await this.listTransactionUseCase.execute(params)

      if (result.isLeft()) throw result.value

      return result.value
    } catch (error) {
      if (error instanceof ListTransactionError) {
        throw new BadRequestException(error.message)
      }
      throw error.message
    }
  }
}
