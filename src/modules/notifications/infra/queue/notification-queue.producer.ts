import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import {
  NotificationRepository,
  SendEmailParams
} from '../../domain/notification.repository'

@Injectable()
export class NotificationQueueProducer implements NotificationRepository {
  constructor(@InjectQueue('notification') private readonly queue: Queue) {}

  async sendTransactionEmail(params: SendEmailParams): Promise<void> {
    await this.queue.add('send-email', params, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    })
  }
}
