import { randomUUID } from 'crypto'

export interface UsersEntityProps {
  id: string
  name: string
  email: string
  password: string
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class UserEntity implements UsersEntityProps {
  private props: UsersEntityProps

  constructor(props: UsersEntityProps) {
    this.props = { ...props }
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get role(): Role {
    return this.props.role
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set password(newPassword: string) {
    this.props.password = newPassword
    this.props.updatedAt = new Date()
  }

  static create(
    props: Omit<UsersEntityProps, 'id' | 'createdAt' | 'updatedAt'>
  ): UserEntity {
    return new UserEntity({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  changePassword(newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    if (newPassword === this.props.password) {
      throw new Error('New password must be different from the old one')
    }

    return new UserEntity({
      ...this.props,
      password: newPassword,
      updatedAt: new Date()
    })
  }
}
