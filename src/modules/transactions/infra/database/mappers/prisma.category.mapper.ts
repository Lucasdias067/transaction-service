import { Prisma } from '@prisma/client'
import {
  TransactionEntity,
  TransactionEntityProps
} from 'src/modules/transactions/domain/entities/transaction.entity'

export class PrismaTransactionMapper {
  static toEntity(
    prismaTransaction: Prisma.TransactionGetPayload<{}>
  ): TransactionEntity {
    const transactionDomain = TransactionEntity.createFromPersistence({
      id: prismaTransaction.id,
      title: prismaTransaction.title,
      amount: prismaTransaction.amount.toNumber(),
      type: prismaTransaction.type,
      userId: prismaTransaction.userId,
      status: prismaTransaction.status,
      categoryId: prismaTransaction.categoryId,
      installmentNumber: prismaTransaction.installmentNumber ?? undefined,
      totalInstallments: prismaTransaction.totalInstallments ?? undefined,
      installmentGroupId: prismaTransaction.installmentGroupId ?? undefined,
      dueDate: prismaTransaction.dueDate ?? undefined,
      paidAt: prismaTransaction.paidAt ?? undefined,
      EffectiveDate: prismaTransaction.EffectiveDate,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt
    })
    return transactionDomain
  }

  static toPersistence(transaction: TransactionEntity): TransactionEntityProps {
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
      dueDate: transaction.dueDate,
      paidAt: transaction.paidAt,
      EffectiveDate: transaction.EffectiveDate,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  }
}