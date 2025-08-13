import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { TransactionEntity } from '../entities/transaction.entity'
import { TransactionRepository } from '../repositories/transaction.repository'

type Response = Either<UseCaseError, TransactionEntity | null>

@Injectable()
export class FindByIdTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string): Promise<Response> {
    if (!id) {
      return left(new UseCaseError('Transaction ID is required'))
    }

    const transaction = await this.transactionRepository.findById(id)

    if (transaction !== null && !(transaction instanceof TransactionEntity)) {
      return left(
        new UseCaseError('Occurred an error while fetching the transaction')
      )
    }

    return right(transaction)
  }
}
