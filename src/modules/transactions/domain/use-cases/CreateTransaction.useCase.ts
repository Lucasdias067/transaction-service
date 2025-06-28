import { Either, left, right } from 'src/core/logic/Either'
import { TransactionEntityProps } from '../entities/transaction.entity'
import { CreateTransactionError } from './errors/CreateTransactionError'
import { Injectable } from '@nestjs/common'
import { PrismaTransactionRepository } from '../../infra/database/repositories/prisma.repository'
import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionMapper } from '../mappers/transaction.mapper'


type Response = Either<
  CreateTransactionError,
  TransactionEntityProps | TransactionEntityProps[]
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(private transactionRespository: PrismaTransactionRepository) {}

  async execute(transaction: TransactionRequestDto): Promise<Response> {
    if (transaction.amount <= 0) {
      return left(
        new CreateTransactionError('Amount must be greater than zero')
      )
    }

    const isInstallmentTransaction =
      typeof transaction.totalInstallments === 'number' &&
      transaction.totalInstallments > 1

    if (isInstallmentTransaction) {
      const transactionDomain = TransactionMapper.toEntity({
        ...transaction,
        installmentNumber: undefined
      })

      const transactionValues =
        await this.transactionRespository.createMany(transactionDomain)

      const transactionValuesMapped = transactionValues.map(transactionValue =>
        TransactionMapper.toHTTP(transactionValue)
      )

      return right(transactionValuesMapped)
    }

    const transactionValue = await this.transactionRespository.create(
      TransactionMapper.toEntity(transaction)
    )

    return right(TransactionMapper.toHTTP(transactionValue))
  }
}
