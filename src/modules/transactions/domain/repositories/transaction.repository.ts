import { PaginateQuery } from 'src/core/dtos/dtos'
import { Transaction } from '../entities/transaction.entity'

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<Transaction>
  abstract createMany(transaction: Transaction): Promise<Transaction[]>
  abstract list(params: PaginateQuery): Promise<any>
  // abstract findById(id: string): Promise<Transaction | null>;
  // abstract save(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  // abstract delete(id: string): Promise<void>;
}
