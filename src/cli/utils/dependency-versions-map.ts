export const dependencyVersionMap = {
  // NextJS + NestJs
  '@apollo/client': '3.12.11',
  'gql.tada': '1.8.10',
} as const

export type AvailableDependencies = keyof typeof dependencyVersionMap
