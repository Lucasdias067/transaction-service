import { Module } from '@nestjs/common'
import { TransactionRepository } from './domain/repositories/transaction.repository'
import { CreateTransactionUseCase } from './domain/use-cases/CreateTransaction.useCase'
import { ListTransactionUseCase } from './domain/use-cases/ListTransaction.useCase'
import { PrismaTransactionRepository } from './infra/database/repositories/prisma.transaction.repository'
import { TransactionController } from './infra/http/controllers/transaction.controller'

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    },
    CreateTransactionUseCase,
    ListTransactionUseCase
  ]
})
export class TransactionModule {}
