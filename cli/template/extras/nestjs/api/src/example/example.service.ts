import { Injectable } from '@nestjs/common'
import { Example } from '@prisma/client'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}

  findMany = (): Promise<Example[]> => {
    return this.prisma.example.findMany()
  }
}
