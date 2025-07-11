// biome-ignore assist/source/organizeImports: <>
import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { TransactionEntity } from 'src/modules/transactions/domain/entities/transaction.entity'
import { TransactionRepository } from 'src/modules/transactions/domain/repositories/transaction.repository'
import { TransactionResponseDto } from '../../http/dtos/transaction.dto'
import { PrismaTransactionMapper } from '../mappers/prisma.mapper'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    @Inject('prismaService') private readonly prismaService: PrismaService
  ) {}

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const prismaTransaction = await this.prismaService.transaction.create({
      data: PrismaTransactionMapper.toPersistence(transaction)
    })
    return PrismaTransactionMapper.toEntity(prismaTransaction)
  }

  async createMany(
    transaction: TransactionEntity
  ): Promise<TransactionEntity[]> {
    const totalOfInstallments = transaction.totalInstallments ?? 1
    const installmentGroupId = randomUUID()
    const userId = transaction.userId

    const transactionInstances = Array.from({
      length: totalOfInstallments
    }).map((_, i) => {
      const installmentDate = new Date(transaction.createdAt)
      installmentDate.setMonth(installmentDate.getMonth() + i)

      const props = {
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId,
        status: transaction.status,
        installmentNumber: i + 1,
        totalInstallments: totalOfInstallments,
        installmentGroupId,
        createdAt: installmentDate
      }

      return TransactionEntity.createFromDTO({ ...props, userId })
    })

    const prismaData = transactionInstances.map(
      PrismaTransactionMapper.toPersistence
    )

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
    params: PaginateQuery,
    options?: { id: string }
  ): Promise<TransactionResponseDto<TransactionEntity>> {
    const page = Number(params.page)
    const per_page = Number(params.per_page)

    let dateFilter = {}
    if (params.date) {
      const date = new Date(params.date)
      const start = new Date(date.getFullYear(), date.getMonth(), 1)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      dateFilter = {
        createdAt: {
          gte: start,
          lt: end
        }
      }
    }

    const userId = options?.id

    const skip = (page - 1) * per_page

    const prismaTransaction = await this.prismaService.transaction.findMany({
      where: {
        ...(userId === '1'
          ? {}
          : {
              userId
            }),
        ...dateFilter
      },
      skip,
      take: per_page
    })

    const totalTransactions = await this.prismaService.transaction.count({
      where: {
        ...(userId === '1'
          ? {}
          : {
              userId
            })
      }
    })

    const data = prismaTransaction.map(PrismaTransactionMapper.toEntity)

    return {
      data,
      meta: {
        total: totalTransactions
      }
    }
  }
}
