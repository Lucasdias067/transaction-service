import { PaginateQuery } from 'src/core/dtos/dto'
import { TransactionResponseDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionEntity } from '../entities/transaction.entity'

export abstract class TransactionRepository {
  abstract create(transaction: TransactionEntity): Promise<TransactionEntity>
  abstract createMany(
    transaction: TransactionEntity
  ): Promise<TransactionEntity[]>
  abstract list(
    query: PaginateQuery,
    options?: UserPayload
  ): Promise<TransactionResponseDto<TransactionEntity>>
  abstract findById(id: string): Promise<TransactionEntity | null>
  // abstract save(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  abstract delete(id: string, userId?: string): Promise<void>
}
