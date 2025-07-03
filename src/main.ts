import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  await app.listen(process.env.PORT ?? 3334)
}
bootstrap()
