import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

@Processor('notification')
export class TransactionEmailConsumer extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
