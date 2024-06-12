import { z } from 'zod'
import { CustomScheme } from './CustomScheme.js'

export class EntityScheme extends CustomScheme {
  constructor ({ context, languageCode }) {
    super({ context, languageCode })
  }

  async getScheme (objet, fieldsProperties) {
    const fields = Object.keys(objet)
    const properties = {}
    for (const field of fields) {
      if (field !== '_id') {
        properties[field] = await this.get(field, fieldsProperties)
      }
    }
    const schema = z.object(properties)
    return schema
  }
}
