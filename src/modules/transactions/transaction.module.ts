import { Module } from '@nestjs/common'

import { CreateTransactionUseCase } from './domain/use-cases/CreateTransaction.useCase'
import { ListTransactionUseCase } from './domain/use-cases/ListTransaction.useCase'
import { TransactionController } from './infra/http/controllers/transaction.controller'
import { TransactionRepository } from './domain/repositories/transaction.repository'
import { PrismaTransactionRepository } from './infra/database/repositories/prisma.repository'

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
