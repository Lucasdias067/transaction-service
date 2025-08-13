declare interface UserPayload {
  sub: string
  email: string
  roles: Role
}

type Role = 'ADMIN' | 'USER'
