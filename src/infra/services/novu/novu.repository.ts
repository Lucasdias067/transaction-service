import { UsersEntityProps } from 'src/modules/users/domain/entities/user.entity'

export abstract class NovuRepository {
  abstract sendTransactionEmail(data: {
    userId: string
    message: string
  }): Promise<void>
  abstract addSubscriber(user: UsersEntityProps): Promise<void>
}
