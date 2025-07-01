interface UserPayload {
  sub: string
  email: string
  roles: Roles
}

interface Roles {
  Admin: 'ADMIN'
  User: 'USER'
}
