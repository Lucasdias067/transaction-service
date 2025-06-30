import { Either, left, right } from 'src/core/logic/Either'
import { TransactionEntityProps } from '../entities/transaction.entity'
import { CreateTransactionError } from './errors/CreateTransactionError'
import { Injectable } from '@nestjs/common'
import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { TransactionRepository } from '../repositories/transaction.repository'

type Response = Either<
  CreateTransactionError,
  TransactionEntityProps | TransactionEntityProps[]
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(private transactionRespository: TransactionRepository) {}

  async execute(
    transaction: TransactionRequestDto,
    userId: string
  ): Promise<Response> {
    if (transaction.amount <= 0) {
      return left(
        new CreateTransactionError('Amount must be greater than zero')
      )
    }

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
        await this.transactionRespository.createMany(transactionDomain)

      const transactionValuesMapped = transactionValues.map(transactionValue =>
        TransactionMapper.toHTTP(transactionValue)
      )

      return right(transactionValuesMapped)
    }

    const transactionValue = await this.transactionRespository.create(
      TransactionMapper.toEntity(transaction, userId)
    )

    return right(TransactionMapper.toHTTP(transactionValue))
  }
}
