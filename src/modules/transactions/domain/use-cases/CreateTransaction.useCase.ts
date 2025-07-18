import { Injectable } from '@nestjs/common'
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
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    transaction: TransactionRequestDto,
    userId: string
  ): Promise<Response> {
    if (transaction.amount <= 0) {
      return left(new UseCaseError('Amount must be greater than zero'))
    }

    if (transaction.type === 'EXPENSE' && transaction.status === 'RECEIVED') {
      throw new Error('EXPENSE transactions cannot have status RECEIVED')
    }

    if (transaction.type === 'INCOME' && transaction.status === 'PAID') {
      throw new Error('INCOME transactions cannot have status PAID')
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
        await this.transactionRepository.createMany(transactionDomain)

      const transactionValuesMapped = transactionValues.map(transactionValue =>
        TransactionMapper.toHTTP(transactionValue)
      )

      return right(transactionValuesMapped)
    }

    const transactionMapperToEntity = TransactionMapper.toEntity(
      transaction,
      userId
    )

    const transactionValue = await this.transactionRepository.create(
      transactionMapperToEntity
    )

    return right(TransactionMapper.toHTTP(transactionValue))
  }
}
