import { Prisma } from '@prisma/client'
import {
  TransactionEntity,
  TransactionEntityProps
} from 'src/modules/transactions/domain/entities/transaction.entity'

export class PrismaTransactionMapper {
  static toEntity(
    prismaTransaction: Prisma.TransactionGetPayload<{
      include: { category: { select: { name: true } } }
    }>
  ): TransactionEntity {
    const transactionDomain = TransactionEntity.createFromPersistence({
      id: prismaTransaction.id,
      title: prismaTransaction.title,
      amount: prismaTransaction.amount.toNumber(),
      type: prismaTransaction.type,
      userId: prismaTransaction.userId,
      status: prismaTransaction.status,
      categoryId: prismaTransaction.categoryId,
      categoryName: prismaTransaction.category?.name,
      installmentNumber: prismaTransaction.installmentNumber ?? undefined,
      totalInstallments: prismaTransaction.totalInstallments ?? undefined,
      installmentGroupId: prismaTransaction.installmentGroupId ?? undefined,
      dueDate: prismaTransaction.dueDate,
      effectiveDate: prismaTransaction.effectiveDate ?? undefined,
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
      effectiveDate: transaction.effectiveDate,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  }
}
