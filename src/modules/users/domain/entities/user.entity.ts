interface UsersEntityProps {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export class UserEntity {
  private props: UsersEntityProps

  constructor(props: UsersEntityProps) {
    this.props = {
      id: props.id,
      email: props.email,
      name: props.name,
      password: props.password,
      role: props.role
    }
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
}
