// biome-ignore assist/source/organizeImports: <>
import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { Transaction } from 'src/modules/transactions/domain/entities/transaction.entity'
import { TransactionRepository } from 'src/modules/transactions/domain/repositories/transaction.repository'
import { TransactionResponseDto } from '../../http/dtos/transaction.dto'
import { PrismaTransactionMapper } from '../mappers/prisma.mapper'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    @Inject('prismaService') private readonly prismaService: PrismaService
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const prismaTransaction = await this.prismaService.transaction.create({
      data: PrismaTransactionMapper.toPersistence(transaction)
    })
    return PrismaTransactionMapper.toEntity(prismaTransaction)
  }

  async createMany(transaction: Transaction): Promise<Transaction[]> {
    const totalOfInstallments = transaction.totalInstallments ?? 1
    const installmentGroupId = randomUUID()

    const transactionInstances = Array.from({
      length: totalOfInstallments
    }).map((_, i) => {
      const installmentDate = new Date(transaction.createdAt)
      installmentDate.setMonth(installmentDate.getMonth() + i)

      const props = {
        id: randomUUID(),
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        userId: transaction.userId,
        status: transaction.status,
        categoryId: transaction.categoryId,
        createdAt: installmentDate,
        updatedAt: new Date(),
        installmentNumber: i + 1,
        totalInstallments: totalOfInstallments,
        installmentGroupId
      }

      return Transaction.create(props)
    })

    const prismaData = transactionInstances.map(
      PrismaTransactionMapper.toPersistence
    )

    console.log(prismaData)

    await this.prismaService.transaction.createMany({
      data: prismaData
    })

    const createdTransactions = await this.prismaService.transaction.findMany({
      where: {
        installmentGroupId
      },
      orderBy: {
        installmentNumber: 'asc'
      }
    })

    return createdTransactions.map(PrismaTransactionMapper.toEntity)
  }

  async list(
    params: PaginateQuery
  ): Promise<TransactionResponseDto<Transaction>> {
    const page = Number(params.page) ?? 1
    const per_page = Number(params.per_page) ?? 10

    const skip = (page - 1) * per_page

    const prismaTransaction = await this.prismaService.transaction.findMany({
      skip,
      take: per_page
    })

    const totalTransactions = await this.prismaService.transaction.count()

    const data = prismaTransaction.map(PrismaTransactionMapper.toEntity)

    return {
      data,
      meta: {
        total: totalTransactions
      }
    }
  }
}
