import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { JOB, NOTIFICATION_QUEUE } from '../queue/contants'

interface EmailJobData {
  userId: string
  message: string
}

type JobData = EmailJobData
type JobName = JOB.SEND_EMAIL

@Processor(NOTIFICATION_QUEUE)
export class NotificationConsumer extends WorkerHost {
  private readonly logger = new Logger(NotificationConsumer.name)

  async process(job: Job<JobData, void, JobName>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`)

    switch (job.name) {
      case JOB.SEND_EMAIL:
        return this.sendTransactionEmail(job.data)
      default:
        throw new Error('Unknown job type')
    }
  }

  private async sendTransactionEmail(data: EmailJobData): Promise<void> {
    this.logger.log(`Sending email to user ${data.userId}: ${data.message}`)

    // TODO: Implementar lógica de envio de email
    // Exemplo: usar Novu

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000))

    this.logger.log(`Email sent successfully to user ${data.userId}`)
  }
}
