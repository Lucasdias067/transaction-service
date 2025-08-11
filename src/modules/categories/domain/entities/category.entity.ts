import { TransactionType } from 'src/core/dtos/dtos'

export interface CategoryEntityProps {
  id: string
  name: string
  type: TransactionType
  userId?: string | null
}

export class CategoryEntity implements CategoryEntityProps {
  private props: CategoryEntityProps

  constructor(props: CategoryEntityProps) {
    this.props = {
      id: props.id,
      name: props.name,
      type: props.type,
      userId: props.userId
    }
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get type(): TransactionType {
    return this.props.type
  }

  get userId(): string | undefined | null {
    return this.props.userId
  }
}
