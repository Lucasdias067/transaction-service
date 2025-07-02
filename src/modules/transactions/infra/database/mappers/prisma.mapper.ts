import { Prisma } from '@prisma/client'
import {
  Transaction,
  TransactionEntityProps
} from 'src/modules/transactions/domain/entities/transaction.entity'

export class PrismaTransactionMapper {
  static toEntity(
    prismaTransaction: Prisma.TransactionGetPayload<{}>
  ): Transaction {
    const transactionDomain = Transaction.create({
      id: prismaTransaction.id,
      title: prismaTransaction.title,
      amount: prismaTransaction.amount,
      type: prismaTransaction.type,
      userId: prismaTransaction.userId,
      status: prismaTransaction.status,
      categoryId: prismaTransaction.categoryId,
      installmentNumber: prismaTransaction.installmentNumber ?? undefined,
      totalInstallments: prismaTransaction.totalInstallments ?? undefined,
      installmentGroupId: prismaTransaction.installmentGroupId ?? undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt
    })
    return transactionDomain
  }

  static toPersistence(transaction: Transaction): TransactionEntityProps {
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
