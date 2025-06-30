import { Module } from '@nestjs/common'
import { TransactionModule } from './modules/transactions/transaction.module'
import { PrismaModule } from './infra/prisma/prisma.module'
import { UserModule } from './modules/users/user.module'

@Module({
  imports: [PrismaModule.forRoot(), TransactionModule, UserModule],
  controllers: [],
  providers: []
})
export class AppModule {}
