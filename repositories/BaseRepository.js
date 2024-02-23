import { ObjectId } from 'mongodb'
import { CollectionScheme } from '../models/collectionScheme.js'
import { Validate } from '../models/Validate.js'
import { ValidatePartial } from '../models/ValidatePartial.js'

export class BaseRepository {
  constructor ({ context, collection, languageCode }) {
    this._context = context
    this._collection = context.collection(collection)
    this._languageCode = languageCode
    this._scheme = null
  }

  async setScheme () {
    const collectionScheme = new CollectionScheme({ languageCode: this._languageCode, collection: this._collection })
    this._scheme = await collectionScheme.getScheme()
  }

  async get ({ queryParams }) {
    const data = await this._collection.find({}).toArray()
    let dataFilter = data

    Object.keys(queryParams).forEach(param => {
      dataFilter = dataFilter.filter(map => map[param] === queryParams[param])
    })

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
    await this.setScheme()
    const result = Validate({ objet, scheme: this._scheme })
    if (!result.success) { throw new Error(result.message) }
    return await this._collection.insertOne(result.data)
  }

  async update ({ id, objet }) {
    await this.setScheme()
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
