import { z } from 'zod'
import { CustomScheme } from './customScheme.js'

export class CollectionScheme extends CustomScheme {
  constructor ({ languageCode, collection }) {
    super({ languageCode })
    this._collection = collection
  }

  async getScheme () {
    const fields = Object.keys(await this._collection.findOne())
    const properties = { }
    for (const field of fields) {
      switch (field) {
        case 'name':
          properties[field] = await this.getName()
          break
        case 'email':
          properties[field] = await this.getEmail()
          break
        case 'rol':
          properties[field] = await this.getRol()
          break
        case 'age':
          properties[field] = await this.getAge()
          break
      }
    }
    const schema = z.object(properties)
    return schema
  }
}
