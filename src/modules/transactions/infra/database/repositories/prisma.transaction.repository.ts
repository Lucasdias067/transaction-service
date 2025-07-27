import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PaginateQuery } from 'src/core/dtos/dtos'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { TransactionEntity } from 'src/modules/transactions/domain/entities/transaction.entity'
import { TransactionRepository } from 'src/modules/transactions/domain/repositories/transaction.repository'
import { TransactionResponseDto } from '../../http/dtos/transaction.dto'
import { PrismaTransactionMapper } from '../mappers/prisma.category.mapper'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(
    @Inject('prismaService') private readonly prismaService: PrismaService
  ) {}

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const prismaTransaction = await this.prismaService.transaction.create({
      data: PrismaTransactionMapper.toPersistence(transaction),
      include: {
        category: { select: { name: true } }
      }
    })
    return PrismaTransactionMapper.toEntity(prismaTransaction)
  }

  async createMany(
    transaction: TransactionEntity
  ): Promise<TransactionEntity[]> {
    const totalOfInstallments = transaction.totalInstallments ?? 1
    const installmentGroupId = randomUUID()
    const userId = transaction.userId
    const baseDate =
      transaction.effectiveDate ?? transaction.dueDate ?? new Date()

    const transactionInstances = Array.from({
      length: totalOfInstallments
    }).map((_, i) => {
      // Para parcelamento, cada parcela tem datas incrementais (mensais)
      const installmentDate = new Date(baseDate)
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
        dueDate: installmentDate,
        effectiveDate: transaction.effectiveDate,
        paidAt: transaction.paidAt
      }

      const entityData = TransactionEntity.createFromDTO({ ...props, userId })

      return entityData
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
    options?: UserPayload
  ): Promise<TransactionResponseDto<TransactionEntity>> {
    const page = Number(params.page)
    const per_page = Number(params.per_page)

    const date = new Date(params.date as Date)
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)

    const skip = (page - 1) * per_page

    const prismaTransaction = await this.prismaService.transaction.findMany({
      include: {
        category: { select: { name: true } }
      },
      where: {
        ...(options?.roles === 'ADMIN'
          ? {}
          : {
              userId: { equals: options?.sub }
            }),
        effectiveDate: {
          gte: start,
          lt: end
        }
      },
      skip,
      take: per_page
    })

    const totalTransactions = await this.prismaService.transaction.count({
      where: {
        ...(options?.roles === 'ADMIN'
          ? {}
          : {
              userId: { equals: options?.sub }
            }),
        effectiveDate: {
          gte: start,
          lt: end
        }
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

  async delete(id: string, userId?: string): Promise<void> {
    await this.prismaService.transaction.delete({
      where: { id, userId }
    })
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } }
      }
    })

    return transaction ? PrismaTransactionMapper.toEntity(transaction) : null
  }
}
