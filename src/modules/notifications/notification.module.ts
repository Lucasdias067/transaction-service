import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { NotificationConsumer } from './application/notification.consumer'
import { NotificationRepository } from './domain/notification.repository'
import { NotificationQueueProducer } from './infra/queue/notification-queue.producer'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    })
  ],
  providers: [
    { provide: NotificationRepository, useClass: NotificationQueueProducer },
    NotificationConsumer
  ],
  exports: [BullModule, NotificationRepository]
})
export class NotificationModule {}
