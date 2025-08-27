import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import metadata from './metadata'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await SwaggerModule.loadPluginMetadata(metadata)

  const config = new DocumentBuilder()
    .setTitle('Finance Management API')
    .setDescription('The finance management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  app.use(helmet())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  await app.listen(process.env.PORT ?? 3334)
}

bootstrap()
