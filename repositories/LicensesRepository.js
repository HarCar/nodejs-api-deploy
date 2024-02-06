import { Licenses } from '../models/Licenses.js'
import { ObjectId } from 'mongodb'
import { Validate } from '../models/Validate.js'
import { ValidatePartial } from '../models/ValidatePartial.js'

export class LicensesRepository {
  constructor ({ context, languageCode }) {
    (async () => {
      this._context = context
      this._collection = context.collection('licenses')
      const license = new Licenses({ languageCode })
      this._scheme = await license.getScheme()
    })()
  }

  async get ({ rol, age }) {
    const licenses = await this._collection.find({}).toArray()
    let dataFilter = licenses

    if (rol) {
      dataFilter = licenses.filter(license => license.rol === rol)
    }

    if (age) {
      dataFilter = licenses.filter(license => license.age === parseInt(age))
    }
    return dataFilter
  }

  async find ({ id }) {
    const _id = new ObjectId(id)
    const data = await this._collection.findOne({ _id })
    return data
  }

  async findByName ({ name }) {
    const data = await this._collection.findOne({ name })
    if (data == null) {
      const record = {
        name,
        email: 'Admin@example.com',
        rol: 'Admin',
        age: 30
      }
      await this._collection.insertOne(record)
      return record
    }
    return data
  }

  async insert ({ objet }) {
    const result = Validate({ objet, scheme: this._scheme })
    if (!result.success) { throw new Error(result.message) }
    return await this._collection.insertOne(result.data)
  }

  async update ({ id, objet }) {
    const result = ValidatePartial({ objet, scheme: this._scheme })
    if (!result.success) { throw new Error(result.message) }

    const _id = new ObjectId(id)
    return await this._collection.updateOne({ _id }, { $set: result.data })
  }

  async delete (id) {
    const _id = new ObjectId(id)
    return await this._collection.deleteOne({ _id })
  }
}
