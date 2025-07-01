interface UserPayload {
  sub: string
  email: string
  roles: any
}

declare namespace Express {
  interface Request {
    user?: UserPayload
  }
}