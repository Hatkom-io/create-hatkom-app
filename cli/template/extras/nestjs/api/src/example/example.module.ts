import { Module } from '@nestjs/common'
import { ExampleResolver } from './example.resolver'
import { ExampleService } from './example.service'

@Module({
  providers: [ExampleService, ExampleResolver],
  exports: [ExampleService],
})
export class ExampleModule {}
