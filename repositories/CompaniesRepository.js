import { ObjectId } from 'mongodb'
import { EntityScheme } from '../models/EntityScheme.js'
import { ValidateScheme } from '../models/ValidateScheme.js'
import { ValidateSchemePartial } from '../models/ValidateSchemePartial.js'
import FieldProperties from '../models/FieldProperties.js'
import Helpers from '../tools/Helpers.js'

export class CompaniesRepository {
  constructor ({ context, contextConfig, entity, languageCode, sessionData }) {
    this._context = context
    this._contextConfig = contextConfig
    this._entity = context.collection(entity)
    this._languageCode = languageCode
    this._scheme = null
    this._sessionData = sessionData
  }

  async setScheme (objet, fieldProperties) {
    const collectionScheme = new EntityScheme({ context: this._context, languageCode: this._languageCode, collection: this._entity })
    this._scheme = await collectionScheme.getScheme(objet, fieldProperties)
  }

  async completeSetup ({ company }) {
    // Add current user to nuew company
    this._entity = this._contextConfig.collection('Users_Companies')
    await this._entity.insertOne({ uid: this._sessionData.uid, CompanyID: company._id })

    // Create Administrator User Group
    this._entity = this._context.collection('UsersGroups')
    const userGroupID = await this._entity.insertOne({ Name: this._languageCode === 'es' ? 'Administrador' : 'Administrator', Default: true })

    // Add current user to Administrator User Group
    this._entity = this._context.collection('Users_Groups')
    await this._entity.insertOne({ UserGroupID: userGroupID, uid: this._sessionData.uid })
  }

  async update ({ id, objet }) {
    await this.setScheme()
    const result = ValidateSchemePartial({ objet, scheme: this._scheme })
    if (!result.success) { throw new Error(result.message) }

    const _id = new ObjectId(id)
    return await this._entity.updateOne({ _id }, { $set: result.data })
  }

  async delete (id) {
    const _id = new ObjectId(id)
    return await this._entity.deleteOne({ _id })
  }

  static async FieldProperties (fieldName) {
    try {
      const fieldsProperties = await this._context.collection('FieldsProperties').find({}).toArray()
      const field = fieldsProperties.find(map => map.Name === fieldName)

      if (field == null) { throw new Error(`No se encontro la propiedad ${fieldName}`) }

      return field
    } catch (err) {
      console.error('Error al leer el archivo local:', err)
      throw new Error(`No se encontro la propiedad ${fieldName}`)
    }
  }
}
