import { DynamicModule, Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

const prismaProvider = {
  provide: 'prismaService',
  useClass: PrismaService
}

@Global()
@Module({
  providers: [prismaProvider]
})
export class PrismaModule {
  static forRoot(): DynamicModule {
    return {
      providers: [prismaProvider],
      exports: [prismaProvider],
      module: PrismaModule
    }
  }
}
