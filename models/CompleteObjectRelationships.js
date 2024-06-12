import FieldProperties from "./FieldProperties.js"
import Helpers from "../tools/Helpers.js"

const CompleteObjectRelationships = async ({ context, data, fieldsProperties, languageCode }) => {
	if (Helpers.any(data)) {
		for (const i in data) {
			if (!Helpers.isNullOrEmpty(data[i][`Caption_${languageCode}`]))
				data[i]["Caption"] = data[i][`Caption_${languageCode}`]

			const fields = Object.keys(data[i])

			for (const field of fields) {
				if (field === "_id") {
					continue
				}

				const fieldProperties = FieldProperties({
					fieldsProperties: fieldsProperties,
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

				if (fieldProperties.Type === "ObjectId") {
					const _id = data[i][field]
					const record = await context.collection(fieldProperties.Source).findOne({ _id })

					if (Helpers.isNull(record)) {
						continue
					}
					if (!Helpers.isNullOrEmpty(record.Name)) {
						const newField = field.replace("ID", "Name")
						data[i][newField] = record.Name
					} else if (!Helpers.isNullOrEmpty(record.Code)) {
						const newField = field.replace("ID", "Name")
						data[i][newField] = record.Code
					} else if (!Helpers.isNullOrEmpty(record.DocID)) {
						const newField = field.replace("ID", "Name")
						data[i][newField] = record.DocID
					} else if (!Helpers.isNullOrEmpty(record[`Caption_${languageCode}`])) {
						const newField = field.replace("ID", "Name")
						data[i][newField] = record[`Caption_${languageCode}`]
					}

					if (!Helpers.isNullOrEmpty(record.Icon)) {
						data[i]["Icon"] = record.Icon
					}
				}
			}
		}
	}
	return data
}

export default CompleteObjectRelationships
