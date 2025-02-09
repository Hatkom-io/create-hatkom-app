import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AppConfigService } from './config/config.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const appConfig = app.get<AppConfigService>(AppConfigService)

  const isDevelopment = appConfig.env === 'development'

  app.use(
    helmet({
      crossOriginEmbedderPolicy: !isDevelopment,
      contentSecurityPolicy: !isDevelopment,
    }),
  )

  const allowedOrigins = [appConfig.webUrl]

  if (isDevelopment || appConfig.env === 'staging') {
    allowedOrigins.push('https://studio.apollographql.com')
  }

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  })

  await app.listen(appConfig.port)
}

bootstrap().catch((e: unknown) => console.error(e))
