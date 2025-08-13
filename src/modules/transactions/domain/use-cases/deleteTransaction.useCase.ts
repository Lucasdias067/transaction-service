import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { TransactionRepository } from '../repositories/transaction.repository'
import { FindByIdTransactionUseCase } from './findByIdTransaction.useCase'

type Response = Either<UseCaseError, { message: string }>

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private findTransactionById: FindByIdTransactionUseCase
  ) {}

  async execute(id: string, userId?: string): Promise<Response> {
    const findTransaction = await this.findTransactionById.execute(id)

    if (findTransaction.value === null) {
      return left(new UseCaseError('Transaction not found'))
    } else if (findTransaction.isLeft()) {
      return left(findTransaction.value)
    }

    await this.transactionRepository.delete(id, userId)

    return right({ message: 'Transaction deleted successfully' })
  }
}
