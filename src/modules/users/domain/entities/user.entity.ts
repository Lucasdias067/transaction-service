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
  private _props: UsersEntityProps

  constructor(props: UsersEntityProps) {
    this._props = { ...props }
  }

  get props(): UsersEntityProps {
    return this._props
  }

  get id(): string {
    return this._props.id
  }

  get name(): string {
    return this._props.name
  }

  get email(): string {
    return this._props.email
  }

  get password(): string {
    return this._props.password
  }

  get role(): Role {
    return this._props.role
  }

  get isActive(): boolean {
    return this._props.isActive
  }

  get createdAt(): Date {
    return this._props.createdAt
  }

  get updatedAt(): Date {
    return this._props.updatedAt
  }

  set password(newPassword: string) {
    this._props.password = newPassword
    this._props.updatedAt = new Date()
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
      ...this._props,
      password: newPassword,
      updatedAt: new Date()
    })
  }
}
