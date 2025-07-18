import { TransactionType } from '@prisma/client'

export interface CategoryRequestDto {
  name: string
  type: TransactionType
}

export interface CategoryResponseDto<T> {
  data: T[]
}
