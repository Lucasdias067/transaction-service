import { DynamicModule, Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [
    {
      provide: 'prismaService',
      useClass: PrismaService
    }
  ]
})
export class PrismaModule {
  static forRoot(): DynamicModule {
    const prismaProvider = {
      provide: 'prismaService',
      useClass: PrismaService
    }

    return {
      providers: [prismaProvider],
      exports: [prismaProvider],
      module: PrismaModule
    }
  }
}
