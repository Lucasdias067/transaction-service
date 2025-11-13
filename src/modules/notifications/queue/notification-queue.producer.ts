import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import {
  NotificationRepository,
  SendEmailParams
} from '../domain/notification.repository'
import { JOB, NOTIFICATION_QUEUE } from './contants'

@Injectable()
export class NotificationQueueProducer implements NotificationRepository {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue) {}

  async sendTransactionEmail(params: SendEmailParams): Promise<void> {
    await this.queue.add(JOB.SEND_EMAIL, params)
  }
}
