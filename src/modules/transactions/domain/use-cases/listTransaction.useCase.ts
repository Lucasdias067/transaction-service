import { Injectable } from '@nestjs/common'
import { PaginateQuery } from 'src/core/dtos/dto'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { TransactionResponseDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionEntityProps } from '../entities/transaction.entity'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionRepository } from '../repositories/transaction.repository'

type Response = Either<
  UseCaseError,
  TransactionResponseDto<TransactionEntityProps>
>

@Injectable()
export class ListTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    query: PaginateQuery,
    options?: UserPayload
  ): Promise<Response> {
    const { page, per_page, date } = query

    if (!options?.sub) {
      return left(new UseCaseError('User required'))
    }

    if (!page || !per_page) {
      return left(new UseCaseError('Pagination parameters are required'))
    }

    if (!date) {
      return left(new UseCaseError('Date parameter is required'))
    }

    const { data: transactionValue, meta } =
      await this.transactionRepository.list(query, options)

    const transactions = transactionValue.map(TransactionMapper.toHTTP)

    if (!transactions) {
      return left(new UseCaseError('Error validating transactions'))
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
