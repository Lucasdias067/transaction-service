import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'
import {
  Transaction,
  TransactionEntityProps
} from '../entities/transaction.entity'

export class TransactionMapper {
  static toEntity(
    transaction: TransactionRequestDto,
    userId: string
  ): Transaction {
    const transactionDomain = Transaction.create({ ...transaction, userId })
    return transactionDomain
  }

  static toHTTP(transaction: Transaction): TransactionEntityProps {
    return {
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      userId: transaction.userId,
      categoryId: transaction.categoryId,
      status: transaction.status,
      installmentNumber: transaction.installmentNumber,
      totalInstallments: transaction.totalInstallments,
      installmentGroupId: transaction.installmentGroupId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  }
}
