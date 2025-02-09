import { Query, Resolver } from '@nestjs/graphql'
import { ExampleModel } from './dto/example.model'
import { ExampleService } from './example.service'

@Resolver(() => ExampleModel)
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query(() => [ExampleModel])
  exampleQuery(): Promise<ExampleModel[]> {
    return this.exampleService.findMany()
  }
}
