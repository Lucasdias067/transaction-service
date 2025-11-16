export interface SendEmailParams {
  userId: string
  message: string
}

export abstract class NotificationRepository {
  abstract sendTransactionEmail(params: SendEmailParams): void
}
