export class ListTransactionError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
