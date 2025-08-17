import {
  PaginatedResponse,
  TransactionStatus,
  TransactionType
} from 'src/core/dtos/dto'

export interface TransactionRequestDto {
  title: string
  amount: number
  type: TransactionType
  categoryId: string
  status: TransactionStatus
  installmentNumber?: number
  totalInstallments?: number
  dueDate?: Date
  paidAt?: Date
  effectiveDate: Date
}

export interface TransactionResponseDto<T> {
  data: T[]
  meta: PaginatedResponse
}
