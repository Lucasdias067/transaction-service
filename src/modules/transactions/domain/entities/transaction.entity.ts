import { randomUUID } from 'node:crypto'
import { TransactionRequestDto } from '../../infra/http/dtos/transaction.dto'

type TransactionType = 'INCOME' | 'EXPENSE'
type TransactionStatus = 'PENDING' | 'PAID' | 'RECEIVED'

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

export class Transaction implements TransactionEntityProps {
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

  set updateAt(date: Date) {
    this.props.updatedAt = date
  }

  static create(
    transaction:
      | (TransactionRequestDto & { userId: string })
      | TransactionEntityProps
  ): Transaction {
    return new Transaction({
      id: 'id' in transaction ? transaction.id : randomUUID(),
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      userId: transaction.userId,
      categoryId: transaction.categoryId,
      status: transaction.status ?? 'PENDING',
      installmentNumber: transaction.installmentNumber ?? 1,
      totalInstallments: transaction.totalInstallments ?? 1,
      installmentGroupId: transaction.installmentGroupId,
      createdAt: transaction.createdAt,
      updatedAt: 'updatedAt' in transaction ? transaction.updatedAt : new Date()
    })
  }
}
