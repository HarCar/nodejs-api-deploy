import { ObjectId } from "mongodb"
import { EntityScheme } from "../models/EntityScheme.js"
import { ValidateScheme } from "../models/ValidateScheme.js"
import FieldProperties from "../models/FieldProperties.js"
import Helpers from "../tools/Helpers.js"

export class CompaniesRepository {
	constructor({ context, contextConfig, entity, languageCode, sessionData }) {
		this._context = context
		this._contextConfig = contextConfig
		this._entity = contextConfig.collection(entity)
		this._languageCode = languageCode
		this._scheme = null
		this._sessionData = sessionData
		this._FieldsProperties = null
	}

	async setScheme(objet) {
		const collectionScheme = new EntityScheme({
			context: this._contextConfig,
			languageCode: this._languageCode,
			collection: this._entity,
		})
		this._scheme = await collectionScheme.getScheme(objet, this._FieldsProperties)
	}
	async setFieldsProperties() {
		this._FieldsProperties = await this._contextConfig.collection("FieldsProperties").find({}).toArray()
	}

	async insert({ objet }) {
		await this.setFieldsProperties()

		await this.setScheme(objet)
		const result = ValidateScheme({ objet, scheme: this._scheme })
		if (!result.success) {
			throw new Error(result.message)
		}

		// / /TODO mejorar esto, debe ser automatico al crear el esquema de zod///
		const fields = Object.keys(result.data)
		for (const field of fields) {
			if (field === "_id") {
				continue
			}

			const fieldProperties = FieldProperties({
				fieldsProperties: this._FieldsProperties,
				fieldName: field,
			})

			if (Helpers.isNull(fieldProperties)) {
				continue
			}

			if (fieldProperties.Type !== "ObjectId") {
				continue
			}

			// result.data[field] = new ObjectId(result.data[field])
			result.data[field] = new ObjectId(`${result.data[field]}`)
		}
		// / /----///
		const ID = await this._entity.insertOne(result.data)
		result.data._id = ID.insertedId
		return result.data
	}

	async completeSetup({ company }) {
		// Add current user to nuew company
		this._entity = this._contextConfig.collection("Users_Companies")
		await this._entity.insertOne({ uid: this._sessionData.uid, CompanyID: company._id })

		// Create Administrator User Group
		this._entity = this._context.collection("UsersGroups")
		const userGroupID = await this._entity.insertOne({
			Name: this._languageCode === "es" ? "Administrador" : "Administrator",
			Default: true,
		})

		// Add current user to Administrator User Group
		this._entity = this._context.collection("Users_Groups")
		await this._entity.insertOne({ UserGroupID: userGroupID.insertedId, uid: this._sessionData.uid })
	}
}
