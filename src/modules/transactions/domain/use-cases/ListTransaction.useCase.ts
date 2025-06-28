import { Either, left, right } from 'src/core/logic/Either'
import { Injectable } from '@nestjs/common'
import { ListTransactionError } from './errors/ListTransactionError'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { TransactionResponseDto } from '../../infra/http/dtos/transaction.dto'
import { PrismaTransactionRepository } from '../../infra/database/repositories/prisma.repository'
import { TransactionMapper } from '../mappers/transaction.mapper'

type Response = Either<ListTransactionError, TransactionResponseDto>

@Injectable()
export class ListTransactionUseCase {
  constructor(private transactionRespository: PrismaTransactionRepository) {}

  async execute(params: PaginateQuery): Promise<Response> {
    const { page, per_page } = params
    const { data: transactionValue, total } =
      await this.transactionRespository.list(params)

    if (transactionValue.length === 0) {
      return left(new ListTransactionError('No transactions found'))
    }

    const transactions = transactionValue.map(TransactionMapper.toHTTP)

    if (!transactions) {
      return left(new ListTransactionError('Error validating transactions'))
    }

    const result = {
      transactions,
      meta: {
        currentPage: Number(page),
        perPage: Number(per_page),
        total
      }
    }

    return right(result)
  }
}
