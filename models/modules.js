import { z } from 'zod'
import { CustomScheme } from './customScheme.js'

export class Sections extends CustomScheme {
  constructor ({ languageCode }) {
    super({ languageCode })
  }

  async getScheme () {
    const schema = z.object({
      name: await this.getName(),
      path: z.string().default(''),
      order: z.number().default(0),
      inactive: this.getInactive()
    })

    return schema
  }
}
