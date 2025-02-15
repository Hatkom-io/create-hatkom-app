import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { AppConfigModule } from './config/config.module'
import { PrismaModule } from './database/prisma.module'
import { ExampleModule } from './example/example.module'
import { GraphqlModule } from './graphql/graphql.module'

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  imports: [AppConfigModule, PrismaModule, GraphqlModule, ExampleModule],
})
export class AppModule {}
