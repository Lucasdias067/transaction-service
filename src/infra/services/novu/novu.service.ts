import { Injectable, Logger } from '@nestjs/common'
import { Novu } from '@novu/api'
import { UsersEntityProps } from 'src/modules/users/domain/entities/user.entity'
import { NovuRepository } from './novu.repository'

interface EmailData {
  userId: string
  message: string
}

@Injectable()
export class NovuService implements NovuRepository {
  private readonly logger = new Logger(NovuService.name)
  private readonly novu: Novu

  constructor() {
    this.novu = new Novu({ secretKey: process.env.NOVU_API_KEY })
  }

  async addSubscriber(user: UsersEntityProps): Promise<void> {
    try {
      await this.novu.subscribers.create({
        subscriberId: user.id,
        email: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1)?.join(' ') || ''
      })
      this.logger.log(
        `Subscriber added/updated in Novu: ${user.id} (${user.email})`
      )
    } catch (error) {
      this.logger.error(
        `Erro ao adicionar/atualizar subscriber no Novu: ${error instanceof Error ? error.message : String(error)}`
      )
      throw error
    }
  }

  async sendTransactionEmail({ userId, message }: EmailData): Promise<void> {
    try {
      await this.novu.trigger({
        to: {
          subscriberId: userId
        },
        payload: {
          message: `testando novu - ${message}`,
          timestamp: new Date().toISOString()
        },
        workflowId: 'transaction-app'
      })
      this.logger.log(`Email enviado via Novu para user ${userId}`)
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email via Novu: ${error instanceof Error ? error.message : String(error)}`
      )
      throw error
    }
  }
}
