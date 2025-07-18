import { randomUUID } from 'node:crypto'
import { TransactionStatus, TransactionType } from 'src/core/dtos/dtos'
import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'

export interface TransactionEntityProps {
  id: string
  title: string
  amount: number
  type: TransactionType
  userId: string
  categoryId: string
  status: TransactionStatus
  installmentNumber?: number
  totalInstallments?: number
  installmentGroupId?: string
  createdAt: Date
  updatedAt: Date
}

export class TransactionEntity implements TransactionEntityProps {
  private props: TransactionEntityProps

  constructor(props: TransactionEntityProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get amount(): number {
    return this.props.amount
  }

  get type(): TransactionType {
    return this.props.type
  }

  get userId(): string {
    return this.props.userId
  }

  get categoryId(): string {
    return this.props.categoryId
  }

  get status(): TransactionStatus {
    return this.props.status
  }

  get installmentNumber(): number | undefined {
    return this.props.installmentNumber
  }

  get totalInstallments(): number | undefined {
    return this.props.totalInstallments
  }

  get installmentGroupId(): string | undefined {
    return this.props.installmentGroupId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date
  }

  static createFromDTO(
    dto: TransactionRequestDto & { userId: string }
  ): TransactionEntity {
    const now = new Date()
    return new TransactionEntity({
      id: randomUUID(),
      title: dto.title,
      amount: dto.amount,
      type: dto.type,
      userId: dto.userId,
      categoryId: dto.categoryId,
      status: dto.status ?? 'PENDING',
      installmentNumber: dto.installmentNumber ?? 1,
      totalInstallments: dto.totalInstallments ?? 1,
      installmentGroupId: dto.installmentGroupId,
      createdAt: dto.createdAt ?? now,
      updatedAt: now
    })
  }

  static createFromPersistence(
    data: TransactionEntityProps
  ): TransactionEntity {
    return new TransactionEntity(data)
  }
}
