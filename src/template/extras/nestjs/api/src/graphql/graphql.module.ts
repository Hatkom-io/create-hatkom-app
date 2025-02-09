import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AppConfigService } from '../config/config.service'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [AppConfigService],
      useFactory: ({ env }: AppConfigService) => ({
        cache: 'bounded',
        debug: false,
        autoSchemaFile: true,
        playground: false,
        nodeEnv: env,
        fieldResolverEnhancers: ['guards'],
        plugins:
          env === 'development'
            ? [ApolloServerPluginLandingPageLocalDefault()]
            : [],
      }),
    }),
  ],
})
export class GraphqlModule {}
