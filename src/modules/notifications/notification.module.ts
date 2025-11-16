import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { NovuModule } from 'src/infra/services/novu/novu.module'
import { NotificationConsumer } from './application/notification.consumer'
import { NotificationRepository } from './domain/notification.repository'
import { NOTIFICATION_QUEUE } from './queue/contants'
import { NotificationQueueProducer } from './queue/notification-queue.producer'

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    }),
    NovuModule
  ],
  providers: [
    { provide: NotificationRepository, useClass: NotificationQueueProducer },
    NotificationConsumer
  ],
  exports: [BullModule, NotificationRepository]
})
export class NotificationModule {}
