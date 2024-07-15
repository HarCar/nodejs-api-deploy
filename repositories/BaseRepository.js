import { ObjectId } from "mongodb"
import { EntityScheme } from "../models/EntityScheme.js"
import { ValidateScheme } from "../models/ValidateScheme.js"
import { ValidateSchemePartial } from "../models/ValidateSchemePartial.js"
import FieldProperties from "../models/FieldProperties.js"
import Helpers from "../tools/Helpers.js"
import Constants from "../tools/Constants.js"

export class BaseRepository {
	constructor({ context, contextConfig, entity, languageCode, sessionData }) {
		this._context = context
		this._contextConfig = contextConfig
		this._entityName = entity
		this._languageCode = languageCode
		this._scheme = null
		this._sessionData = sessionData
		this._FieldsProperties = null
		this.getContext = () => {
			return Constants.ISAV_CONFIG_ENTITIES.some((map) => map === entity) ? this._contextConfig : this._context
		}
		this._entity = this.getContext().collection(entity)
	}

	async setScheme(objet) {
		const entityScheme = new EntityScheme({
			context: this.getContext(),
			languageCode: this._languageCode,
		})
		this._scheme = await entityScheme.getScheme(objet, this._FieldsProperties)
	}

	async setFieldsProperties() {
		this._FieldsProperties = await this.getContext().collection("FieldsProperties").find({}).toArray()
	}

	async getScreens() {
		// const collections = await this.getContext().listCollections().toArray()
		// const collectionNames = collections.map((collection) => collection.name)
		// return collectionNames
	}

	async get({ queryParams, entity = "" }) {
		const filters = Helpers.createFiltersFromQueryParams(queryParams)
		await this.setFieldsProperties()

		let dataFilter = []
		if (!Helpers.isNullOrEmpty(entity)) {
			dataFilter = await this.getContext().collection(entity).find(filters).toArray()
		} else {
			dataFilter = await this._entity.find(filters).toArray()
		}
		if (Helpers.any(dataFilter)) {
			for (const i in dataFilter) {
				const fields = Object.keys(dataFilter[i])
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

					if (fieldProperties.Type !== "ObjectId" && fieldProperties.Type !== "stringList") {
						continue
					}

					if (Helpers.isNullOrEmpty(fieldProperties.Source)) {
						continue
					}

					if (fieldProperties.Type === "ObjectId") {
						const _id = dataFilter[i][field]
						const data = await this.getContext().collection(fieldProperties.Source).findOne({ _id })
						if (Helpers.isNull(data)) {
							continue
						}

						if (!Helpers.isArrayEmpty(data.Name)) {
							const newField = field.replace("ID", "Name")
							dataFilter[i][newField] = data.Name
						} else if (!Helpers.isArrayEmpty(data.Code)) {
							const newField = field.replace("ID", "Name")
							dataFilter[i][newField] = data.Code
						} else if (!Helpers.isArrayEmpty(data.DocID)) {
							const newField = field.replace("ID", "Name")
							dataFilter[i][newField] = data.DocID
						}
					}
				}

				if (dataFilter[i].Type === "stringList" && !Helpers.isNullOrEmpty(dataFilter[i].Source)) {
					const data = []
					let dataSource = []
					if (dataFilter[i].Source === "CollectionNames") {
						dataSource = await this.getScreens()
					} else {
						dataSource = await this.get({
							queryParams: null,
							collection: dataFilter[i].Source,
						})
					}

					if (Helpers.any(dataSource)) {
						for (const d in dataSource) {
							let selected = false
							if (Helpers.any(dataFilter[i].Screens)) {
								selected = dataFilter[i].Screens.some((map) => map === dataSource[d])
							}
							data.push({ Name: dataSource[d], Selected: selected })
						}
					}
					dataFilter[i].Data = data
				}
			}
		}

		return Object.values(dataFilter)
	}

	async find({ id, entity = "" }) {
		await this.setFieldsProperties()
		const _id = new ObjectId(`${id}`)
		let data = null

		if (!Helpers.isNullOrEmpty(entity)) {
			data = await this.getContext().collection(entity).findOne({ _id })
		} else {
			data = await this._entity.findOne({ _id })
		}

		if (!Helpers.isNull(data)) {
			const fields = Object.keys(data)
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

				if (Helpers.isNullOrEmpty(fieldProperties.Source)) {
					continue
				}

				const _id = data[field]
				const dataValue = await this.getContext().collection(fieldProperties.Source).findOne({ _id })

				if (Helpers.isNull(dataValue)) {
					continue
				}

				if (!Helpers.isArrayEmpty(dataValue.Name)) {
					const newField = field.replace("ID", "Name")
					data[newField] = dataValue.Name
				} else if (!Helpers.isArrayEmpty(data.Code)) {
					const newField = field.replace("ID", "Name")
					data[newField] = dataValue.Code
				} else if (!Helpers.isArrayEmpty(data.DocID)) {
					const newField = field.replace("ID", "Name")
					data[newField] = dataValue.DocID
				}
			}
		}

		return data
	}

	async findByName({ name }) {
		const data = await this._entity.findOne({ name })
		if (data == null) {
			const record = {
				name,
				email: "Admin@example.com",
				rol: "Admin",
				age: 30,
			}
			await this._entity.insertOne(record)
			return record
		}
		return data
	}

	async insert({ objet }) {
		const objetResult = []
		await this.setFieldsProperties()

		if (Array.isArray(objet)) {
			for (const item of objet) {
				await this.setScheme(item)
				const result = ValidateScheme({ objet: item, scheme: this._scheme })
				if (!result.success) {
					throw new Error(result.message)
				}

				// / /TODO mejorar esto, debe ser automatico al crear el esquema de zod///
				const fields = Object.keys(result.data)
				for (const field of fields) {
					if (field !== "_id") {
						const fieldProperties = FieldProperties({
							fieldsProperties: this._FieldsProperties,
							filterName: field,
						})
						if (fieldProperties.Type === "ObjectId") {
							result.data[field] = new ObjectId(result.data[field])
						}
					}
				}
				// / /----///

				const ID = await this._entity.insertOne(result.data)
				result.data._id = ID
				objetResult.push(result.data)
			}
		} else {
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

				result.data[field] = new ObjectId(result.data[field])
			}
			// / /----///

			const ID = await this._entity.insertOne(result.data)
			result.data._id = ID.insertedId.toString()
			return result.data
		}

		return objetResult
	}

	async update({ id, objet }) {
		await this.setScheme()
		const result = ValidateSchemePartial({ objet, scheme: this._scheme })
		if (!result.success) {
			throw new Error(result.message)
		}

		const _id = new ObjectId(id)
		return await this._entity.updateOne({ _id }, { $set: result.data })
	}

	async delete(id) {
		const _id = new ObjectId(id)
		return await this._entity.deleteOne({ _id })
	}
}
