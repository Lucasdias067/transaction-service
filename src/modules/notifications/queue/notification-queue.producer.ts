import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import {
  NotificationRepository,
  SendEmailParams
} from '../domain/notification.repository'
import { NOTIFICATION_JOB, NOTIFICATION_QUEUE } from './contants'

@Injectable()
export class NotificationQueueProducer implements NotificationRepository {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue) {}

  sendTransactionEmail(params: SendEmailParams) {
    this.queue.add(NOTIFICATION_JOB.SEND_EMAIL, params)
  }
}
