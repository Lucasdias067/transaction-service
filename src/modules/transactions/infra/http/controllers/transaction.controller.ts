import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { PaginateQuery } from 'src/core/dtos/dto'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard'
import { CreateTransactionUseCase } from 'src/modules/transactions/domain/use-cases/createTransaction.useCase'
import { DeleteTransactionUseCase } from 'src/modules/transactions/domain/use-cases/deleteTransaction.useCase'
import { ListTransactionUseCase } from 'src/modules/transactions/domain/use-cases/listTransaction.useCase'
import { TransactionRequestDto } from '../dtos/transaction.dto'

@Controller('/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionUseCase: ListTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase
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
  async list(@Query() query: PaginateQuery, @Req() request: Request) {
    const options = request.user

    const result = await this.listTransactionUseCase.execute(query, options)

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UseCaseError) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException(error)
    }

    return result.value
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request) {
    const userId = request.user?.sub as string

    const result = await this.deleteTransactionUseCase.execute(id, userId)

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
