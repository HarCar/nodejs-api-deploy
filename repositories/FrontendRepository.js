import Constants from "../tools/Constants.js"
import CompleteObjectRelationships from "../models/CompleteObjectRelationships.js"
import FieldsProperties from "../models/FieldsProperties.js"
import CompleteSource from "../models/CompleteSource.js"

export class FrontendRepository {
	constructor({ context, contextConfig, entity, languageCode, sessionData }) {
		this._context = context
		this._contextConfig = contextConfig
		this._entityName = entity
		this._languageCode = languageCode
		this._sessionData = sessionData
		this._entity = context.collection(entity)
	}

	async getScreens() {
		// const collections = await this.getContext().listCollections().toArray()
		// const collectionNames = collections.map((collection) => collection.name)
		// return collectionNames
	}

	async getFieldsPropertiesForCompany() {
		const data = await this._contextConfig
			.collection(Constants.ENTITY_FIELDS_PROPERTIES)
			.find({ Screens: "Companies" })
			.toArray()
		return data
	}

	async getDataScreen({ entity }) {
		let actions = await this._context.collection(Constants.ENTITY_ACTIONS).find({}).toArray()
		const fieldsProperties = await FieldsProperties({ context: this._context })

		actions = await CompleteObjectRelationships({
			context: this._context,
			data: actions,
			fieldsProperties,
			languageCode: this._languageCode,
		})

		let formFieldsEntity = fieldsProperties.filter((item) => item.Screens.includes(entity))
		formFieldsEntity = await CompleteSource({
			context: this._context,
			data: formFieldsEntity,
			languageCode: this._languageCode,
		})

		return { actions, sessionData: this._sessionData, formFields: formFieldsEntity }
	}
}
