import { PaginatedResponse } from 'src/core/dtos/dtos'
import { TransactionEntityProps } from 'src/modules/transactions/domain/entities/transaction.entity'

export interface TransactionRequestDto {
  title: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  status: 'PENDING' | 'PAID'
  installmentNumber?: number
  totalInstallments?: number
  installmentGroupId: undefined
  createdAt: Date
}

export interface TransactionResponseDto {
  transactions: TransactionEntityProps[]
  meta: PaginatedResponse
}
