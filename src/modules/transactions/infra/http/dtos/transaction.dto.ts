import { PaginatedResponse } from 'src/core/dtos/dtos'

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

export interface TransactionResponseDto<T> {
  data: T[]
  meta: PaginatedResponse
}
