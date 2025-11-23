import { Module } from '@nestjs/common'
import { NovuRepository } from './novu.repository'
import { NovuService } from './novu.service'

const providers = {
  provide: NovuRepository,
  useClass: NovuService
}

@Module({
  providers: [providers],
  exports: [NovuRepository]
})
export class NovuModule {}
