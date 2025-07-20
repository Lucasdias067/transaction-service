import { DynamicModule, Global, Module } from '@nestjs/common'
import { BcryptService } from './bcrypt.service'

const bcryptProvider = {
  provide: 'bcryptService',
  useClass: BcryptService
}

@Global()
@Module({
  providers: [bcryptProvider]
})
export class BcryptModule {
  static forRoot(): DynamicModule {
    return {
      module: BcryptModule,
      providers: [bcryptProvider],
      exports: [bcryptProvider]
    }
  }
}
