import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { NotificationRepository } from 'src/modules/notifications/domain/notification.repository'
import { TransactionRepository } from '../repositories/transaction.repository'
import { FindByIdTransactionUseCase } from './findByIdTransaction.useCase'

type Response = Either<UseCaseError, { message: string }>

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private findTransactionById: FindByIdTransactionUseCase,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(id: string, userId?: string): Promise<Response> {
    const findTransaction = await this.findTransactionById.execute(id)

    if (findTransaction.value === null) {
      return left(new UseCaseError('Transaction not found'))
    } else if (findTransaction.isLeft()) {
      return left(findTransaction.value)
    }

    await this.transactionRepository.delete(id, userId)

    this.notificationRepository.sendTransactionEmail({
      userId: findTransaction.value.userId,
      message: `Transaction with ID ${id} has been deleted.`
    })

    return right({ message: 'Transaction deleted successfully' })
  }
}
