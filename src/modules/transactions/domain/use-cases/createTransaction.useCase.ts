import { Injectable } from '@nestjs/common'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
import { NotificationRepository } from 'src/modules/notifications/domain/notification.repository'
import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionEntityProps } from '../entities/transaction.entity'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionRepository } from '../repositories/transaction.repository'

type Response = Either<
  UseCaseError,
  TransactionEntityProps | TransactionEntityProps[]
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private notificationQueue: NotificationRepository
  ) {}

  async execute(
    transaction: TransactionRequestDto,
    userId: string
  ): Promise<Response> {
    const isInstallmentTransaction =
      typeof transaction.totalInstallments === 'number' &&
      transaction.totalInstallments > 1

    if (isInstallmentTransaction) {
      const transactionDomain = TransactionMapper.toEntity(
        {
          ...transaction,
          installmentNumber: undefined
        },
        userId
      )

      const transactionValues =
        await this.transactionRepository.createMany(transactionDomain)

      if (!transactionValues) {
        return left(new UseCaseError('Error on creating installments'))
      }

      this.notificationQueue.sendTransactionEmail({
        userId,
        message: `Your transaction has been created successfully.`
      })

      return right(transactionValues.map(TransactionMapper.toHTTP))
    }

    const transactionMapperToEntity = TransactionMapper.toEntity(
      transaction,
      userId
    )

    const transactionValue = await this.transactionRepository.create(
      transactionMapperToEntity
    )

    if (!transactionValue) {
      return left(new UseCaseError('Error on creating transactions'))
    }

    this.notificationQueue.sendTransactionEmail({
      userId,
      message: `Your transaction has been created successfully.`
    })

    return right(TransactionMapper.toHTTP(transactionValue))
  }
}
