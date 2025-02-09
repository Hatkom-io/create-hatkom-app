import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ExampleId } from '@prisma/client'

@ObjectType('Example')
export class ExampleModel {
  @Field(() => ID)
  id!: ExampleId
}
