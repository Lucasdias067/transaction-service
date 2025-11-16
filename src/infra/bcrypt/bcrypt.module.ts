import { DynamicModule, Global, Module } from '@nestjs/common'
import { BcryptService } from './bcrypt.service'
import { PasswordHasherRepository } from './passwordHasher.repository'

const bcryptProvider = {
  provide: PasswordHasherRepository,
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
