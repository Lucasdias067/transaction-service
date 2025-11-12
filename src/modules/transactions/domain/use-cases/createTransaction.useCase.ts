import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { UseCaseError } from 'src/core/errors/UseCaseErrors'
import { Either, left, right } from 'src/core/logic/Either'
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
    @InjectQueue('notification') private notificationQueue: Queue
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

      const transactions = transactionValues.map(TransactionMapper.toHTTP)

      await this.notificationQueue.add('sendTransactionNotification', {
        userId,
        message: `Your ${transaction.totalInstallments} installments transaction has been created successfully.`
      })

      return right(transactions)
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

    await this.notificationQueue.add('sendTransactionNotification', {
      userId,
      message: `Your ${transaction.totalInstallments} installments transaction has been created successfully.`
    })

    return right(TransactionMapper.toHTTP(transactionValue))
  }
}
