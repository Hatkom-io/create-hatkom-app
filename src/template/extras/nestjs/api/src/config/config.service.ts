import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { z } from 'zod'

const validEnvs = ['development', 'production', 'staging', 'test'] as const

const validationObject = z.object({
  APP_ENV: z.enum(validEnvs),
  PORT: z.string().min(0).max(65535),
  WEB_URL: z.string().url(),
})

@Injectable()
export class AppConfigService {
  static validate = (
    config: Record<string, unknown>,
  ): z.infer<typeof validationObject> => validationObject.parse(config)

  constructor(
    private readonly configService: ConfigService<
      z.infer<typeof validationObject>,
      true
    >,
  ) {}

  get env(): (typeof validEnvs)[number] {
    return this.configService.get('APP_ENV')
  }
  get port(): number {
    return Number(this.configService.get('PORT'))
  }
  get webUrl(): string {
    return this.configService.get<string>('WEB_URL')
  }
}
