import { z } from 'zod'
import { CustomScheme } from './customScheme.js'

export class Licenses extends CustomScheme {
  constructor ({ languageCode }) {
    super({ languageCode })
  }

  async getScheme () {
    const schema = z.object({
      name: await this.getName(),
      email: await this.getEmail(),
      rol: await this.getRol(),
      age: await this.getAge()
    })

    return schema
  }
}
