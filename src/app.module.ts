import { Module } from '@nestjs/common'
import { PrismaModule } from './infra/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { TransactionModule } from './modules/transactions/transaction.module'
import { UserModule } from './modules/users/user.module'

@Module({
  imports: [PrismaModule.forRoot(), TransactionModule, UserModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
