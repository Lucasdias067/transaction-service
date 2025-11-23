import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { NovuRepository } from 'src/infra/services/novu/novu.repository'
import { NOTIFICATION_JOB, NOTIFICATION_QUEUE } from '../queue/contants'

interface EmailJobData {
  userId: string
  message: string
}

type JobData = EmailJobData
type JobName = NOTIFICATION_JOB

@Processor(NOTIFICATION_QUEUE)
export class NotificationConsumer extends WorkerHost {
  private readonly logger = new Logger(NotificationConsumer.name)

  constructor(private novuRepository: NovuRepository) {
    super()
  }

  async process(job: Job<JobData, void, JobName>): Promise<void> {
    switch (job.name) {
      case NOTIFICATION_JOB.SEND_EMAIL:
        return await this.novuRepository.sendTransactionEmail(job.data)
      default:
        throw new Error('Unknown job type')
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job<JobData, void, JobName>): void {
    this.logger.log(`Job ${job.name}:${job.id} is now active`)
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<JobData, void, JobName>): void {
    this.logger.log(`Job ${job.name}:${job.id} completed successfully`)
  }
}
