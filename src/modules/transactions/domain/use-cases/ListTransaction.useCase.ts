import { Injectable } from '@nestjs/common'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { Either, left, right } from 'src/core/logic/Either'
import { TransactionResponseDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionEntityProps } from '../entities/transaction.entity'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionRepository } from '../repositories/transaction.repository'
import { ListTransactionError } from './errors/ListTransactionError'

type Response = Either<
  ListTransactionError,
  TransactionResponseDto<TransactionEntityProps>
>

@Injectable()
export class ListTransactionUseCase {
  constructor(private transactionRespository: TransactionRepository) {}

  async execute(params: PaginateQuery): Promise<Response> {
    const { page, per_page } = params
    const { data: transactionValue, meta } =
      await this.transactionRespository.list(params)

    if (transactionValue.length === 0) {
      return left(new ListTransactionError('No transactions found'))
    }

    const transactions = transactionValue.map(TransactionMapper.toHTTP)

    if (!transactions) {
      return left(new ListTransactionError('Error validating transactions'))
    }

    const result = {
      data: transactions,
      meta: {
        currentPage: Number(page),
        perPage: Number(per_page),
        total: meta.total
      }
    }

    return right(result)
  }
}
