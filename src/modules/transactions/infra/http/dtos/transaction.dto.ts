import { TransactionStatus, TransactionType } from '@prisma/client'
import { PaginatedResponse } from 'src/core/dtos/dtos'

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
  EffectiveDate: Date 
}

export interface TransactionResponseDto<T> {
  data: T[]
  meta: PaginatedResponse
}