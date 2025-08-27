import { TransactionStatus, TransactionType } from '@prisma/client'

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator'
import { PaginatedResponse } from 'src/core/dtos/dto'

export class TransactionRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ser um número com até 2 casas decimais.' }
  )
  @IsPositive({ message: 'O valor deve ser positivo.' })
  amount: number

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType

  @IsUUID('4', { message: 'O ID da categoria é inválido.' })
  @IsNotEmpty()
  categoryId: string

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus

  @IsInt()
  @IsPositive()
  @IsOptional()
  installmentNumber?: number

  @IsInt()
  @IsPositive()
  @IsOptional()
  totalInstallments?: number

  @IsDateString({}, { message: 'A data de vencimento é inválida.' })
  @IsOptional()
  dueDate?: Date

  @IsDateString({}, { message: 'A data de pagamento é inválida.' })
  @IsOptional()
  paidAt?: Date

  @IsDateString({}, { message: 'A data de efetivação é inválida.' })
  @IsNotEmpty()
  effectiveDate: Date
}

export interface TransactionResponseDto<T> {
  data: T[]
  meta: PaginatedResponse
}
