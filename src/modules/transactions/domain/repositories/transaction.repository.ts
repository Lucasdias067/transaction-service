import { PaginateQuery } from 'src/core/dtos/dtos'
import { TransactionResponseDto } from '../../infra/http/dtos/transaction.dto'
import { TransactionEntity } from '../entities/transaction.entity'

export abstract class TransactionRepository {
  abstract create(transaction: TransactionEntity): Promise<TransactionEntity>
  abstract createMany(
    transaction: TransactionEntity
  ): Promise<TransactionEntity[]>
  abstract list(
    params: PaginateQuery,
    options?: UserPayload
  ): Promise<TransactionResponseDto<TransactionEntity>>
  // abstract findById(id: string): Promise<Transaction | null>;
  // abstract save(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  // abstract delete(id: string): Promise<void>;
}
