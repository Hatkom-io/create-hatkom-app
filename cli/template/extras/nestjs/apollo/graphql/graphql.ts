import { initGraphQLTada } from 'gql.tada'
import { introspection } from '../../../../../../test/web/graphql-env'

export const graphql = initGraphQLTada<{
  introspection: typeof introspection
  scalars: {
    DateTime: string
    JSONObject: object
    Float: number
  }
}>()
