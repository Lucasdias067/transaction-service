import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { BcryptModule } from './infra/bcrypt/bcrypt.module'
import { PrismaModule } from './infra/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoryModule } from './modules/categories/category.module'
import { TransactionModule } from './modules/transactions/transaction.module'
import { UserModule } from './modules/users/user.module'

@Module({
  imports: [
    PrismaModule.forRoot(),
    BcryptModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    }),
    TransactionModule,
    UserModule,
    AuthModule,
    CategoryModule
  ]
})
export class AppModule {}
