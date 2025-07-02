import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req
} from '@nestjs/common'
import { Request } from 'express'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { CreateTransactionUseCase } from 'src/modules/transactions/domain/use-cases/CreateTransaction.useCase'
import { CreateTransactionError } from 'src/modules/transactions/domain/use-cases/errors/CreateTransactionError'
import { ListTransactionError } from 'src/modules/transactions/domain/use-cases/errors/ListTransactionError'
import { ListTransactionUseCase } from 'src/modules/transactions/domain/use-cases/ListTransaction.useCase'
import { TransactionRequestDto } from '../dtos/transaction.dto'

@Controller('/transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionUseCase: ListTransactionUseCase
  ) {}

  @Post()
  async create(@Body() body: TransactionRequestDto, @Req() request: Request) {
    // const { sub: userId } = request.user!

    try {
      const result = await this.createTransactionUseCase.execute(body, '1')

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
