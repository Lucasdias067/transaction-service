import { Module } from '@nestjs/common'
import { TransactionModule } from './modules/transactions/transaction.module'
import { PrismaModule } from './infra/prisma/prisma.module'

@Module({
  imports: [PrismaModule.forRoot(), TransactionModule],
  controllers: [],
  providers: []
})
export class AppModule {}
