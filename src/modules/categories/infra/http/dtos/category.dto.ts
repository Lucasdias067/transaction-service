import { TransactionType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CategoryRequestDto {
  /**
   * Nome da categoria.
   * @example 'Salário'
   */
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string

  /**
   * Tipo da transação associada à categoria (RECEITA ou DESPESA).
   * @example 'INCOME'
   */
  @IsEnum(TransactionType, { message: 'O tipo é inválido.' })
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  type: TransactionType
}

export interface CategoryResponseDto<T> {
  data: T[]
}
