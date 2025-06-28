export class CreateTransactionError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
