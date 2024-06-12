import { z } from "zod"
import t from "../resources.js"

export class CustomScheme {
	constructor({ context, languageCode }) {
		this._languageCode = languageCode
		this._context = context
	}

	async get(fieldName, fieldsProperties) {
		const field = fieldsProperties.find((map) => map.Name === fieldName)
		if (field == null) {
			throw new Error(`No se encontro la propiedad ${fieldName}`)
		}

		const caption = field[`Caption_${this._languageCode}`]

		let validation
		let message = caption + " " + t(this._languageCode, "invalid")
		if (field.Type === "string" || field.Type === "ObjectId" || field.Type === "icon") {
			validation = z.string({ invalid_type_error: message })
		} else if (field.Type === "number") {
			validation = z.number({ invalid_type_error: message })
		} else if (field.Type === "checkbox") {
			validation = z.boolean({ invalid_type_error: message })
		} else if (field.Type === "stringList") {
			validation = z.array(z.string(), { invalid_type_error: message })
		} else {
			throw new Error(`No se encontro el tipo de dato ${field.Type} para la propiedad ${fieldName}`)
		}

		if (field.Required === true && typeof validation.nonempty === "function") {
			message = caption + t(this._languageCode, "required")
			validation = validation.nonempty({ message })
		}

		if (field.Min && field.Min >= 0 && typeof validation.min === "function") {
			const message = caption + " " + t(this._languageCode, "min")
			validation = validation.min(field.Min, { message })
		}

		if (field.Max && field.Max >= 0 && typeof validation.max === "function") {
			message = caption + " " + t(this._languageCode, "max")
			validation = validation.max(field.Max, { message })
		}

		return validation
	}
}
