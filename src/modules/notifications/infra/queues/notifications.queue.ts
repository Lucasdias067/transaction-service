import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

@Injectable()
export class NotificationQueue extends Queue {
  constructor() {}
}
