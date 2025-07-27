import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { TransactionRepository } from '../repositories/transaction.repository'

type Response = Either<UseCaseError, { message: string }>

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(id: string, userId?: string): Promise<Response> {
    const findTransaction = await this.transactionRepository.findById(id)

    if (!findTransaction) {
      return left(new UseCaseError('Transaction not found'))
    }

    await this.transactionRepository.delete(id, userId)

    return right({ message: 'Transaction deleted successfully' })
  }
}
