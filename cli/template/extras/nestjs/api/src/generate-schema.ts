import { writeFileSync } from 'node:fs'
import { NestFactory } from '@nestjs/core'
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql'
import { Glob } from 'bun'
import { printSchema } from 'graphql'
import { flatten, isFunction, isObject } from 'lodash'

// Note: run y nest build first to make use of nest-cli plugin to add decorators
async function generateSchema() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule)
  await app.init()

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
  const glob = new Glob('./**/*.resolver.js')
  const resolverFiles = [...glob.scanSync({ absolute: true })]

  const resolvers = flatten(
    await Promise.all(
      resolverFiles.map(async (file) => {
        const resolver: unknown = await import(file)

        if (!isObject(resolver)) {
          throw new Error(`Resolver file ${file} does not export an object`)
        }

        return Object.values(resolver).filter(
          (resolver): resolver is () => unknown => isFunction(resolver),
        )
      }),
    ),
  )

  const schema = await gqlSchemaFactory.create(resolvers)
  writeFileSync('schema.gql', printSchema(schema))
}
generateSchema().catch((e: unknown) => console.error(e))
